// Prefer the API's own message over axios' generic "Request failed with status code 500"
export const getErrorMessage = (error) => {
    const message = error?.response?.data?.message || error?.message || 'Something went wrong';
    return message.replace(/^Server error:\s*/, '');
};

// The API answers 401 for missing, invalid or expired tokens
export const isAuthError = (error) => error?.response?.status === 401;

// Generated images arrive as base64 data URLs; a Blob URL holds the same PNG in about
// half the memory and makes downloads instant. Callers must revoke it when done.
export const dataUrlToObjectUrl = async (dataUrl) => {
    const blob = await (await fetch(dataUrl)).blob();
    return URL.createObjectURL(blob);
};
