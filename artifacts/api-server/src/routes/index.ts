import { Router, type IRouter } from "express";
import healthRouter from "./health";
import extractRouter from "./extract";
import generateRouter from "./generate";
import runsRouter from "./runs";
import stripeRouter from "./stripe";
import { requireAuth } from "../middleware/requireAuth";
import { rateLimiter } from "../middleware/rateLimiter";

const router: IRouter = Router();

// Public routes — no auth needed
router.use(healthRouter);
router.use(stripeRouter);

// Protected routes — must be authenticated
router.use(requireAuth);

// Rate limited routes — 10 requests per user per hour
router.use(rateLimiter);
router.use(extractRouter);
router.use(generateRouter);

// Authenticated but not rate limited
router.use(runsRouter);

export default router;