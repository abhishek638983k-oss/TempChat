import express from "express";
import {
    createReq,
    requests,
    accepReq,
} from "../controller/requestControler.js";
import authenticateToken from "../middleware/authenticate.js";
const router = express.Router();
router.put("/:requestId/accept", authenticateToken, accepReq);
router.post("/", authenticateToken, createReq);
router.get("/", authenticateToken, requests);

export default router;
