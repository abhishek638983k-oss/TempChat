import test from "node:test";
import assert from "node:assert/strict";

import { getNewMessages } from "../public/js/chatUtils.js";

test("returns only unseen messages when polling for updates", () => {
    const existingMessages = [
        { _id: "1", msg: "hello", from: { _id: "user-1" } },
        { _id: "2", msg: "hi", from: { _id: "user-2" } },
    ];

    const incomingMessages = [
        { _id: "1", msg: "hello", from: { _id: "user-1" } },
        { _id: "2", msg: "hi", from: { _id: "user-2" } },
        { _id: "3", msg: "new message", from: { _id: "user-1" } },
        { _id: "4", msg: "another new message", from: { _id: "user-2" } },
    ];

    assert.deepEqual(getNewMessages(existingMessages, incomingMessages), [
        { _id: "3", msg: "new message", from: { _id: "user-1" } },
        { _id: "4", msg: "another new message", from: { _id: "user-2" } },
    ]);
});
