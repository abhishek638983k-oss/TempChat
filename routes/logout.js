import express from "express";
import authenticateToken from "../middleware/authenticate.js";
const router = express.Router();
router.post("/", authenticateToken, (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).redirect("/login");
});
export default router;
