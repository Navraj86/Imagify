const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

export const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
export const RAZORPAY_TEST_MODE = RAZORPAY_KEY?.startsWith('rzp_test_') ?? false;

let loading = null;
let logo = null;

// Razorpay can't fetch images from localhost (and some hosts), so hand it the logo inline as a data: URL
export const getCheckoutLogo = () => {
    if (!logo) {
        logo = fetch('/apple-icon')
            .then(res => res.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            }))
            .catch(() => {
                logo = null;
                return undefined;
            });
    }
    return logo;
};

// Resolves with window.Razorpay, injecting the checkout script once. Safe to call repeatedly:
// call it early to warm up, and again on click to wait for it if it hasn't finished yet.
export const loadRazorpay = () => {
    if (typeof window === 'undefined') return Promise.reject(new Error('Razorpay needs a browser'));
    if (window.Razorpay) return Promise.resolve(window.Razorpay);

    if (!loading) {
        loading = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = CHECKOUT_SRC;
            script.async = true;
            script.onload = () => window.Razorpay ? resolve(window.Razorpay) : reject(new Error('Razorpay checkout failed to initialise'));
            script.onerror = () => {
                // Allow a retry on the next click (e.g. after the connection comes back)
                loading = null;
                script.remove();
                reject(new Error('Could not load Razorpay checkout'));
            };
            document.body.appendChild(script);
        });
    }
    return loading;
};
