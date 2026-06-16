import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  keyGenerator: (req) => {
    // Rate limit per authenticated user, not per IP
    return (req as any).user?.id || req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests. You have reached the limit of 10 generations per hour.",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});