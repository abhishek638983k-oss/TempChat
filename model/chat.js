import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        msg: {
            type: String,
            required: true,
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
