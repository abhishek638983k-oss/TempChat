import express from "express";
import authenticateToken from "../middleware/authenticate.js";
const router = express.Router();

router.get("/", authenticateToken, (req, res) => {
    res.status(200).render("home.ejs", {
        username: req.user?.username || "User",
    });
});

export default router;
