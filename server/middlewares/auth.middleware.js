import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            if (!req.body) req.body = {};
            req.body.userId = tokenDecode.id;
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};

export default userAuth;
