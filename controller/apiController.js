import mongoose, { Error } from "mongoose";
import User from "../model/user.js";

const isUserOnline = (user) => {
    if (!user?.lastActiveAt) return false;

    const timeoutMs = (user.onlineTimeoutMinutes || 5) * 60 * 1000;
    return Date.now() - new Date(user.lastActiveAt).getTime() <= timeoutMs;
};

export const friendApi = async (req, res) => {
    try {
        const id = req.user.id;

        const user = await User.findById(id).populate({
            path: "friends",
            select: "username online lastActiveAt onlineTimeoutMinutes",
        });

        const friends = (user?.friends || []).map((friend) => ({
            ...friend.toObject(),
            online: isUserOnline(friend),
        }));

        res.status(200).json({
            friends,
        });
    } catch (error) {
        res.status(401).json({
            msg: error.message || "Unknown error occurred",
        });
    }
};
