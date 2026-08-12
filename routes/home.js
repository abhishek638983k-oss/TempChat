import express from "express";
import { login, register } from "../controller/loginControler.js";
import authenticateToken from "../middleware/authenticate.js";
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).render("home.ejs");
});

export default router;
