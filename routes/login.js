import express from "express";
import { login, register } from "../controller/loginControler.js";
import authenticateToken from "../middleware/authenticate.js";
const router = express.Router();

router.post("/register", register);
router.get("/", (req, res) => {
    res.render("login.ejs");
});
router.post("/", login);

export default router;
