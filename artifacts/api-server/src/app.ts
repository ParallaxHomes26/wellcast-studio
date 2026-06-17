import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import stripeWebhookHandler from "./routes/stripeWebhook";

const app: Express = express();

app.use(pinoHttp({ logger }));

// Build the allowed-origins list from env so production domains (Vercel, custom
// domain) are included without hardcoding them here.
const allowedOrigins = [
  process.env.APP_URL,
  process.env.REPLIT_DEV_URL,
  "https://getwellcast.com",
  "https://www.getwellcast.com",
  "http://localhost:5173",
].filter((o): o is string => Boolean(o));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Stripe webhook needs raw body BEFORE express.json() parses it
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhookHandler);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api", router);

export default app;
