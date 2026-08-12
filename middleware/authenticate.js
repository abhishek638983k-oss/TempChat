import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function authenticateToken(req, res, next) {
    const token = req.cookies?.token;
    const isJsonRoute = ["/api", "/chat", "/request"].some((prefix) =>
        req.originalUrl.startsWith(prefix),
    );

    if (!token) {
        if (isJsonRoute) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        return res.status(401).redirect("/login");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (isJsonRoute) {
                return res.status(403).json({
                    msg: "Invalid token",
                });
            }

            return res.status(403).redirect("/login");
        }

        req.user = user;

        next();
    });
}
