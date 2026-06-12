import { Router, type IRouter } from "express";
import healthRouter from "./health";
import extractRouter from "./extract";
import generateRouter from "./generate";
import runsRouter from "./runs";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(extractRouter);
router.use(generateRouter);
router.use(runsRouter);
router.use(storageRouter);

export default router;
