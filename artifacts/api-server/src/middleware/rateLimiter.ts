import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    // All rate-limited routes are behind requireAuth, so user.id is always set
    return (req as any).user?.id ?? "anonymous";
  },
  handler: (_req, res) => {
    res.status(429).json({
      error: "Too many requests. You have reached the limit of 10 generations per hour.",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false },
});
