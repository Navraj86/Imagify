// Must match the backend's CURRENCY, which is what Razorpay actually charges
export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || 'INR';

const formatters = new Map();

export const formatPrice = (amount, { decimals = 0 } = {}) => {
    const key = `${CURRENCY}:${decimals}`;
    if (!formatters.has(key)) {
        formatters.set(key, new Intl.NumberFormat(CURRENCY === 'INR' ? 'en-IN' : 'en-US', {
            style: 'currency',
            currency: CURRENCY,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }));
    }
    return formatters.get(key).format(amount);
};
