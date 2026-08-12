import mongoose, { Error } from "mongoose";
import User from "../model/user.js";

export const friendApi = async (req, res) => {
    try {
        const id = req.user.id;

        const user = await User.findById(id).populate("friends", "username");

        res.status(200).json({
            friends: user.friends,
        });
    } catch (error) {
        res.status(401).json({
            msg: error.message || "Unknown error occurred",
        });
    }
};
