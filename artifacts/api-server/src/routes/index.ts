import { Router, type IRouter } from "express";
import healthRouter from "./health";
import extractRouter from "./extract";
import generateRouter from "./generate";
import runsRouter from "./runs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(extractRouter);
router.use(generateRouter);
router.use(runsRouter);

export default router;
