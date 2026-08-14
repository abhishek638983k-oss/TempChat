import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.js";

dotenv.config();

const isUserOnline = (user) => {
    if (!user?.lastActiveAt) return false;

    const timeoutMs = (user.onlineTimeoutMinutes || 5) * 60 * 1000;
    return Date.now() - new Date(user.lastActiveAt).getTime() <= timeoutMs;
};

export default async function authenticateToken(req, res, next) {
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

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            if (isJsonRoute) {
                return res.status(403).json({
                    msg: "Invalid token",
                });
            }

            return res.status(403).redirect("/login");
        }

        try {
            const dbUser = await User.findById(user.id);

            if (dbUser) {
                const online = isUserOnline(dbUser);
                dbUser.lastActiveAt = new Date();
                dbUser.online = true;

                if (!online) {
                    dbUser.online = true;
                }

                await dbUser.save();
            }

            req.user = user;
            next();
        } catch (error) {
            if (isJsonRoute) {
                return res.status(500).json({ msg: "Authentication failed" });
            }

            return res.status(500).redirect("/login");
        }
    });
}
