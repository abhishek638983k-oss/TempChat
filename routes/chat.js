import express from "express";
import { sendChats, createChat } from "../controller/chatControler.js";
import authenticateToken from "../middleware/authenticate.js";
const router = express.Router();
router.get("/:id", authenticateToken, sendChats);
router.post("/", authenticateToken, createChat);

export default router;
