import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({ success: false, message: "Please sign in to continue." });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (!tokenDecode.id) {
            return res.status(401).json({ success: false, message: "Invalid session. Please sign in again." });
        }
        // Attach to the request itself rather than req.body, which GET requests don't have
        req.userId = tokenDecode.id;
        next();
    } catch (error) {
        const message = error.name === 'TokenExpiredError'
            ? "Your session has expired. Please sign in again."
            : "Invalid session. Please sign in again.";
        return res.status(401).json({ success: false, message });
    }
};

export default userAuth;
