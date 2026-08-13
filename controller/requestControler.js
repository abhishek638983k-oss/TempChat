import mongoose, { Error } from "mongoose";
import FriendRequest from "../model/request.js";
import User from "../model/user.js";

export const createReq = async (req, res) => {
    try {
        const from = req.user.id;
        const to = req.body.username;

        if (!from || !to) {
            throw new Error("Sender and receiver both are required");
        }

        // Find receiver
        const userTo = await User.findOne({ username: to });

        if (!userTo) {
            throw new Error("Receiver does not exist");
        }

        const receiverId = userTo._id;

        // 1. Cannot send request to yourself
        if (from.toString() === receiverId.toString()) {
            throw new Error("You cannot send a friend request to yourself");
        }

        // 2. Already friends?
        const alreadyFriends = await User.exists({
            _id: from,
            friends: receiverId,
        });

        if (alreadyFriends) {
            throw new Error("You are already friends with this user");
        }

        // 3. Did I already send them a pending request?
        const existingRequest = await FriendRequest.findOne({
            from: from,
            to: receiverId,
            status: "pending",
        });

        if (existingRequest) {
            throw new Error("Friend request already sent");
        }

        // 4. Did they already send me a pending request?
        const reverseRequest = await FriendRequest.findOne({
            from: receiverId,
            to: from,
            status: "pending",
        });

        if (reverseRequest) {
            throw new Error("This user has already sent you a friend request");
        }

        // 5. No relationship exists → create request
        await FriendRequest.create({
            from,
            to: receiverId,
            status: "pending",
        });

        res.status(201).json({
            msg: `Request sent to ${to}`,
        });
    } catch (error) {
        res.status(400).json({
            msg: error.message,
        });
    }
};

export const requests = async (req, res) => {
    try {
        const userid = req.user.id;
        const friendRequests = await FriendRequest.find({
            to: userid,
        }).populate("from", "username");
        res.json(friendRequests);
    } catch (error) {
        res.status(401).json({ msg: "usernaem required " });
    }
};

export const accepReq = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({
                message: "Request not found",
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                message: "Request already handled",
            });
        }

        request.status = "accepted";
        await request.save();

        await User.findByIdAndUpdate(request.from, {
            $addToSet: {
                friends: request.to,
            },
        });

        await User.findByIdAndUpdate(request.to, {
            $addToSet: {
                friends: request.from,
            },
        });

        await FriendRequest.findByIdAndDelete(requestId);

        res.json({
            message: "Friend request accepted",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};
