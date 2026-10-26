import axios from "axios";
import FormData from "form-data";
import userModel from "../models/user.model.js";
import { serverError } from "../utils/http.js";

const CLIPDROP_URL = 'https://clipdrop-api.co/text-to-image/v1';
const MAX_PROMPT_LENGTH = 1000;
const GENERATION_TIMEOUT_MS = 60_000;

const refundCredit = (userId) =>
    userModel.updateOne({ _id: userId }, { $inc: { creditBalance: 1 } })
        .catch(error => console.error('Credit refund failed for user', userId, error));

export const generateImage = async (req, res) => {
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';

    if (!prompt) {
        return res.status(400).json({ success: false, message: "Please enter a prompt" });
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
        return res.status(400).json({ success: false, message: `Prompts can be up to ${MAX_PROMPT_LENGTH} characters` });
    }

    let user;
    try {
        // Reserve a credit atomically: parallel requests can't spend more credits than the user has
        user = await userModel.findOneAndUpdate(
            { _id: req.userId, creditBalance: { $gt: 0 } },
            { $inc: { creditBalance: -1 } },
            { new: true, projection: { creditBalance: 1 } }
        );

        if (!user) {
            const existing = await userModel.findById(req.userId).select('creditBalance').lean();
            if (!existing) {
                return res.status(401).json({ success: false, message: "Account not found. Please sign in again." });
            }
            return res.json({ success: false, message: "Insufficient credits", creditBalance: existing.creditBalance });
        }
    } catch (error) {
        return serverError(res, error);
    }

    try {
        const formData = new FormData();
        formData.append("prompt", prompt);

        const { data } = await axios.post(CLIPDROP_URL, formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer',
            timeout: GENERATION_TIMEOUT_MS
        });

        res.status(200).json({
            success: true,
            message: "Image generated successfully",
            creditBalance: user.creditBalance,
            resultImage: `data:image/png;base64,${Buffer.from(data).toString('base64')}`
        });
    } catch (error) {
        // Generation failed, so the reserved credit goes back to the user
        await refundCredit(req.userId);

        const status = error.response?.status;
        if (status === 400) {
            return res.status(400).json({ success: false, message: "This prompt couldn't be processed. Try rewording it." });
        }
        if (error.code === 'ECONNABORTED') {
            return res.status(504).json({ success: false, message: "Image generation timed out. Please try again." });
        }
        if (axios.isAxiosError(error)) {
            // Bad API key, out of API credits, rate limited or Clipdrop down: not something the user can fix
            const detail = error.response?.data ? Buffer.from(error.response.data).toString().slice(0, 200) : error.code;
            console.error(`Clipdrop request failed (${status ?? 'no response'}): ${detail}`);
            return res.status(503).json({ success: false, message: "Image generation is temporarily unavailable. Please try again later." });
        }
        serverError(res, error);
    }
};
