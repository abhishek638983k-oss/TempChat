import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).redirect("/login");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                msg: "Invalid token",
            });
        }

        req.user = user;

        next();
    });
}
