import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        from: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
            unique: true,
        },
        to: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
            unique: true,
        },
        msg: {
            type: String,
            trim: true,
            maxlength: 200,
        },
    },
    {
        timestamps: true,
    },
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
