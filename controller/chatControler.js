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

        const receiver = await User.findOne({ _id: to });
        console.log(receiver);
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
            .json({ msg: error.message || "something went wrong" });
    }
};

export const sendChats = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const friendId = req.params.id;

        const friend = await User.findById(friendId).select("username");

        if (!friend) {
            return res.status(404).send("User not found");
        }

        const messages = await Chat.find({
            $or: [
                {
                    from: currentUserId,
                    to: friendId,
                },
                {
                    from: friendId,
                    to: currentUserId,
                },
            ],
        })
            .populate("from", "username")
            .populate("to", "username")
            .sort({ createdAt: 1 });

        res.render("chat", {
            messages,
            friend,
            friendId,
            currentUserId,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

export const getMessagesForChat = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const friendId = req.params.id;

        const messages = await Chat.find({
            $or: [
                { from: currentUserId, to: friendId },
                { from: friendId, to: currentUserId },
            ],
        })
            .populate("from", "username")
            .populate("to", "username")
            .sort({ createdAt: 1 });

        return res.status(200).json(messages);
    } catch (error) {
        return res
            .status(500)
            .json({ msg: error.message || "something went wrong" });
    }
};
