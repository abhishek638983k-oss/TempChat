import express from "express";
import authenticateToken from "../middleware/authenticate.js";
import slidingWindowRateLimit from "../middleware/rateLimiter.js";
import { friendApi } from "../controller/apiController.js";
const router = express.Router();
router.get(
    "/friend",
    authenticateToken,
    slidingWindowRateLimit({ windowMs: 60000, maxRequests: 30 }),
    friendApi,
);
export default router;
