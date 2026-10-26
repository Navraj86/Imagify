import crypto from "crypto";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import razorpay from "razorpay";
import transactionModel from "../models/transaction.model.js";
import { serverError } from "../utils/http.js";

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Source of truth for prices; the client's plans list must match
const PLANS = {
    Basic: { credits: 100, amount: 10 },
    Advanced: { credits: 500, amount: 50 },
    Business: { credits: 5000, amount: 250 },
};

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const normalizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : '');

const registerUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        const email = normalizeEmail(req.body.email);

        if (typeof name !== 'string' || typeof password !== 'string' || !name.trim() || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" });
        }
        if (!EMAIL_PATTERN.test(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email address" });
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({ success: false, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
        }

        const existingUser = await userModel.exists({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "An account with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({ name, email, password: hashedPassword });

        res.status(201).json({
            success: true,
            token: signToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        // Two sign-ups racing past the exists() check hit the unique index instead
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "An account with this email already exists" });
        }
        serverError(res, error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Strings only: an object like { "$ne": null } would otherwise become a Mongo query operator
        if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
            return res.status(400).json({ success: false, message: "Please enter your email and password" });
        }

        // Accounts created before emails were normalized may be stored with their original casing.
        // The fallback goes through the raw collection because Mongoose would lowercase the query value too.
        const user = await userModel.findOne({ email: normalizeEmail(email) })
            ?? await userModel.collection.findOne({ email: email.trim() });

        // Same response for unknown email and wrong password, so emails can't be probed
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        res.status(200).json({
            success: true,
            token: signToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        serverError(res, error);
    }
};

const userCredits = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select('name creditBalance').lean();
        if (!user) {
            return res.status(401).json({ success: false, message: "Account not found. Please sign in again." });
        }

        res.json({
            success: true,
            credits: user.creditBalance,
            user: {
                _id: user._id,
                name: user.name,
            }
        });
    } catch (error) {
        serverError(res, error);
    }
};

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentRazorpay = async (req, res) => {
    try {
        const { planId } = req.body;
        // hasOwn: keys like "constructor" or "__proto__" must not resolve to Object.prototype members
        const plan = Object.hasOwn(PLANS, planId) ? PLANS[planId] : null;
        if (!plan) {
            return res.status(400).json({ success: false, message: "Invalid plan" });
        }

        const userData = await userModel.findById(req.userId).select('name email').lean();
        if (!userData) {
            return res.status(401).json({ success: false, message: "Account not found. Please sign in again." });
        }

        const transaction = await transactionModel.create({
            userId: req.userId,
            plan: planId,
            amount: plan.amount,
            credits: plan.credits,
            date: Date.now()
        });

        const order = await razorpayInstance.orders.create({
            amount: plan.amount * 100,
            currency: process.env.CURRENCY || 'INR',
            receipt: String(transaction._id)
        });
        await transactionModel.updateOne({ _id: transaction._id }, { orderId: order.id });

        res.json({
            success: true,
            order,
            transactionId: transaction._id,
            credits: plan.credits,
            user: {
                _id: userData._id,
                name: userData.name,
                email: userData.email
            }
        });
    } catch (error) {
        // Errors from the Razorpay SDK carry a statusCode; anything else is ours
        if (error?.statusCode) {
            console.error('Razorpay order creation failed:', error.statusCode, error.error?.description);
            return res.status(502).json({ success: false, message: "Couldn't start the payment. Please try again." });
        }
        serverError(res, error);
    }
}

// Razorpay signs order_id|payment_id with the key secret; a match proves the payment response is genuine
const isValidSignature = (orderId, paymentId, signature) => {
    const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
    return typeof signature === 'string'
        && signature.length === expected.length
        && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !isValidSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        const [orderInfo, payment] = await Promise.all([
            razorpayInstance.orders.fetch(razorpay_order_id),
            razorpayInstance.payments.fetch(razorpay_payment_id),
        ]);

        if (payment.order_id !== orderInfo.id || payment.amount !== orderInfo.amount) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        // If the account isn't set to auto-capture, a successful payment is only "authorized".
        // Capture it here; otherwise the customer is charged but the order never becomes "paid".
        if (payment.status === 'authorized') {
            await razorpayInstance.payments.capture(payment.id, payment.amount, payment.currency);
        } else if (payment.status !== 'captured') {
            return res.status(400).json({ success: false, message: "Payment not completed" });
        }

        // Flip payment false -> true atomically so retries or parallel requests can only credit once
        const transaction = await transactionModel.findOneAndUpdate(
            { _id: orderInfo.receipt, userId: req.userId, payment: false },
            { payment: true },
            { new: true }
        );

        if (!transaction) {
            const alreadyPaid = await transactionModel.exists({ _id: orderInfo.receipt, userId: req.userId, payment: true });
            if (alreadyPaid) {
                const user = await userModel.findById(req.userId).select('creditBalance').lean();
                return res.json({ success: true, message: "Payment already processed", creditBalance: user?.creditBalance });
            }
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        const user = await userModel.findByIdAndUpdate(
            transaction.userId,
            { $inc: { creditBalance: transaction.credits } },
            { new: true, projection: { creditBalance: 1 } }
        );

        res.json({
            success: true,
            message: "Credits added successfully",
            creditsAdded: transaction.credits,
            creditBalance: user?.creditBalance
        });
    } catch (error) {
        serverError(res, error);
    }
}

export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay };
