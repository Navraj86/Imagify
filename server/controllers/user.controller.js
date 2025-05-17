import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import razorpay from "razorpay";
import transactionModel from "../models/transaction.model.js";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            res.status(200).json({
                success: true,
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } else {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};

const userCredits = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        res.json({
            success: true,
            credits: user.creditBalance,
            user: {
                _id: user._id,
                name: user.name,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentRazorpay = async (req, res) => {
    try {
        const { userId, planId } = req.body;
        const userData = await userModel.findById(userId);

        if (!userId || !planId) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" });
        }

        let credits, plan, amount, date

        switch (planId) {
            case 'Basic':
                plan = 'Basic';
                credits = 100;
                amount = 10;
                break;
            case 'Advanced':
                plan = 'Advanced';
                credits = 500;
                amount = 50;
                break;
            case 'Business':
                plan = 'Business';
                credits = 5000;
                amount = 250;
                break;
            default:
                return res.status(400).json({ success: false, message: "Invalid plan" });
        }

        date = Date.now();

        const transactionData = {
            userId,
            plan,
            amount,
            credits,
            date
        }

        const newTransaction = await transactionModel.create(transactionData);

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id
        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: error });
            }

            res.json({
                success: true,
                order,
                transactionId: newTransaction._id,
                credits,
                user: {
                    _id: userData._id,
                    name: userData.name,
                    email: userData.email
                }
            });
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            const transactionData = await transactionModel.findById(orderInfo.receipt);
            if (transactionData.payment) {
                return res.status(400).json({ success: false, message: "Payment Failed" });
            }

            const userData = await userModel.findById(transactionData.userId);
            const creditBalance = userData.creditBalance + transactionData.credits;
            await userModel.findByIdAndUpdate(userData._id, { creditBalance });
            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

            res.json({
                success: true,
                message: "CCredits added successfully"
            });
        } else {
            res.status(400).json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
}

export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay };
