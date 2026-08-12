import mongoose, { Error } from "mongoose";
import Chat from "../model/chat.js";
import User from "../model/user.js";

export const createChat = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { to, msg } = req.body;

        if (!to || !msg) {
            return res
                .status(400)
                .json({ msg: "receiver and message are required" });
        }

        const receiver = await User.findOne({ username: to });

        if (!receiver) {
            return res.status(404).json({ msg: "Receiver not found" });
        }

        if (senderId.toString() === receiver._id.toString()) {
            return res
                .status(400)
                .json({ msg: "You cannot send a message to yourself" });
        }

        const chat = await Chat.create({
            from: senderId,
            to: receiver._id,
            msg,
        });

        const populatedChat = await chat.populate([
            { path: "from", select: "username" },
            { path: "to", select: "username" },
        ]);

        return res.status(201).json(populatedChat);
    } catch (error) {
        return res
            .status(500)
            .json({ msg: error.message || "error aa gaya bete" });
    }
};

export const sendChats = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const { username } = req.query;

        let query = {
            $or: [{ from: currentUserId }, { to: currentUserId }],
        };

        if (username) {
            const otherUser = await User.findOne({ username });

            if (!otherUser) {
                return res.status(404).json({ msg: "User not found" });
            }

            query = {
                $and: [
                    {
                        $or: [{ from: currentUserId }, { to: currentUserId }],
                    },
                    {
                        $or: [{ from: otherUser._id }, { to: otherUser._id }],
                    },
                ],
            };
        }

        const chats = await Chat.find(query)
            .populate("from", "username")
            .populate("to", "username")
            .sort({ createdAt: 1 });

        return res.status(200).json(chats);
    } catch (error) {
        return res
            .status(500)
            .json({ msg: error.message || "Failed to fetch chats" });
    }
};
