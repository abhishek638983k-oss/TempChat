import express from "express";
import { login, register } from "../controller/loginControler.js";
import authenticateToken from "../middleware/authenticate.js";
import slidingWindowRateLimit from "../middleware/rateLimiter.js";
const router = express.Router();

router.post(
    "/register",
    slidingWindowRateLimit({ windowMs: 60000, maxRequests: 5 }),
    register,
);
router.get("/", (req, res) => {
    res.render("login.ejs");
});
router.post(
    "/",
    slidingWindowRateLimit({ windowMs: 60000, maxRequests: 8 }),
    login,
);

export default router;
