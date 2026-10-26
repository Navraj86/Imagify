// Shared scroll-reveal animation for motion components
export const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] },
};
