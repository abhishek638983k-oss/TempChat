import mongoose, { Error } from "mongoose";
import Chat from "../model/chat.js";

export const createChat = async (req, res) => {
    try {
        const { from, to, msg } = req.body;

        if (!from || !to) {
            return res
                .status(400)
                .json({ msg: "sender and receiver are required" });
        }

        const chat = await Chat.create({
            from,
            to,
            msg,
        });

        return res.status(201).json(chat);
    } catch (error) {
        return res
            .status(500)
            .json({ msg: error.message || "error aa gaya bete" });
    }
};

export const sendChats = async (req, res) => {
    try {
        const chats = await Chat.find({});
        return res.status(200).json(chats);
    } catch (error) {
        return res
            .status(500)
            .json({ msg: error.message || "Failed to fetch chats" });
    }
};
