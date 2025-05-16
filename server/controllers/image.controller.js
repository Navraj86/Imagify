import axios from "axios";
import userModel from "../models/user.model.js";
import FormData from "form-data";

export const generateImage = async (req, res) => {
    try {
        const { userId, prompt } = req.body;

        const user = await userModel.findById(userId);
        if (!user || !prompt) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        if (user.creditBalance === 0 || user.creditBalance < 0) {
            return res.json({ success: false, message: "Insufficient credits", creditBalance: user.creditBalance });
        }

        const formData = new FormData();
        formData.append("prompt", prompt);

        try {            
            const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API,
                },
                responseType: 'arraybuffer'
            })
    
            const base64Image = Buffer.from(data, 'binary').toString('base64');
            const resultImage = `data:image/png;base64,${base64Image}`;
    
            await userModel.findByIdAndUpdate(user._id, {creditBalance: user.creditBalance - 1});
    
            res.status(200).json({
                success: true,
                message: "Image generated successfully",
                creditBalance: user.creditBalance - 1,
                resultImage
            });
        } catch (apiError) {
            if (apiError.response && apiError.response.status === 402) {
                await creditsmaker();
                return res.status(503).json({
                    success: false,
                    message: "Service temporarily unavailable."
                });
            }
            throw apiError;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};

const creditsmaker = async () => {
    try {
        console.log("API key expired, running creditsmaker function");
    } catch (error) {
        console.error("Error in creditsmaker:", error);
    }
};