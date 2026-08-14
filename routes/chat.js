import express from "express";
import {
    sendChats,
    createChat,
    getMessagesForChat,
} from "../controller/chatControler.js";
import authenticateToken from "../middleware/authenticate.js";
import slidingWindowRateLimit from "../middleware/rateLimiter.js";
const router = express.Router();
router.get(
    "/poll/:id",
    authenticateToken,
    slidingWindowRateLimit({ windowMs: 60000, maxRequests: 30 }),
    getMessagesForChat,
);
router.get("/:id", authenticateToken, sendChats);
router.post(
    "/",
    authenticateToken,
    slidingWindowRateLimit({ windowMs: 60000, maxRequests: 30 }),
    createChat,
);

export default router;
