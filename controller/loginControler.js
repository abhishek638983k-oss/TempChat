import mongoose, { Error } from "mongoose";
import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(401).json({ msg: "not enough cradencials" });

        const user = await User.findOne({ username: username });

        if (!user) return res.status(401).json({ msg: "user not found" });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ msg: "wrong password" });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        res.status(201).json({ msg: "login Succesfull" });
    } catch (error) {
        res.status(500).json({ msg: error.message || "unknown error accured" });
    }
};

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(401).json({
                msg: "username or password is not avalable in reqBody",
            });
        if (password.length < 4)
            return res.status(401).json({ msg: "too sort password" });

        const user = await User.findOne({ username: username });

        if (user) return res.status(401).json({ msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await User.create({
            username: username,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: createdUser._id, username: createdUser.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        res.status(201).json({ msg: "registration Succesfull" });
    } catch (error) {
        res.status(500).json({ msg: error.message || "unknown error accured" });
    }
};
