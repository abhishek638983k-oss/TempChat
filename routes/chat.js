import express from "express";
import {
    sendChats,
    createChat,
    getMessagesForChat,
} from "../controller/chatControler.js";
import authenticateToken from "../middleware/authenticate.js";
const router = express.Router();
router.get("/poll/:id", authenticateToken, getMessagesForChat);
router.get("/:id", authenticateToken, sendChats);
router.post("/", authenticateToken, createChat);

export default router;
