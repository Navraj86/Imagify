// Log the real error server-side, but never leak internals to the client
export const serverError = (res, error) => {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
};
