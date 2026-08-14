const rateLimitStore = new Map();

export const slidingWindowRateLimit = ({
    windowMs = 60000,
    maxRequests = 10,
    keyGenerator = (req) => req.user?.id || req.ip || "unknown",
    message = "Too many requests. Please try again later.",
    statusCode = 429,
} = {}) => {
    return (req, res, next) => {
        const now = Date.now();
        const key = keyGenerator(req);
        const requestTimes = rateLimitStore.get(key) || [];

        const validRequests = requestTimes.filter(
            (timestamp) => now - timestamp < windowMs,
        );

        if (validRequests.length >= maxRequests) {
            return res.status(statusCode).json({
                msg: message,
            });
        }

        validRequests.push(now);
        rateLimitStore.set(key, validRequests);

        next();
    };
};

export default slidingWindowRateLimit;
