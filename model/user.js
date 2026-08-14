import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    joinedAt: {
        type: Date,
        default: Date.now,
    },

    online: {
        type: Boolean,
        default: false,
    },

    lastActiveAt: {
        type: Date,
        default: Date.now,
    },

    onlineTimeoutMinutes: {
        type: Number,
        default: 3,
    },

    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
});

const User = mongoose.model("User", userSchema);

export default User;
