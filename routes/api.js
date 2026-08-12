import express from "express";
import authenticateToken from "../middleware/authenticate.js";
import { friendApi } from "../controller/apiController.js";
const router = express.Router();
router.get("/friend", authenticateToken, friendApi);
export default router;
