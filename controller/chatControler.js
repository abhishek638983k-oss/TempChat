import mongoose, { Error } from "mongoose";
import Chat from "../model/chat.js";

export const createChat = async (req, res) => {
    try {
        const { from, to, msg } = req.body;

        if (!from || !to) {
            throw new Error("sender and receiver are required");
        } else {
            const chat = await Chat.create({
                from,
                to,
                msg,
            });

            res.json(chat);
        }
    } catch (error) {
        res.json({ msg: error || "error aa gaya bete" });
    }
};

export const sendChats = async (req, res) => {
    const chats = await Chat.find({});
    res.json(chats);
};
