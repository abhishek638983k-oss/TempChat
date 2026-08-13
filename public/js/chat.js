import { getNewMessages } from "./chatUtils.js";

const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messagesContainer = document.getElementById("messages");

const initialMessages = Array.from(
    messagesContainer.querySelectorAll(".message-row"),
).map((row, index) => ({
    _id: row.dataset.messageId || `initial-${index}`,
    msg: row.querySelector("p")?.textContent || "",
    from: { _id: row.classList.contains("sent") ? "me" : "friend" },
    createdAt: new Date().toISOString(),
}));

let lastKnownMessages = initialMessages;

messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const msg = messageInput.value.trim();

    if (!msg) return;
    sendMsg(msg);
});

async function sendMsg(msg) {
    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: id,
                msg: msg,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Failed to send message");
            return;
        }

        addMessage(data);
        messageInput.value = "";
        scrollToBottom();
    } catch (err) {
        console.error(err);
    }
}

function addMessage(message) {
    const row = document.createElement("div");
    const isSent = String(message.from?._id || "") === String(currentUserId);

    row.classList.add("message-row", isSent ? "sent" : "received");
    row.dataset.messageId = message._id;

    row.innerHTML = `
        <div class="message">
            <p>${escapeHTML(message.msg)}</p>
            <span class="time">
                ${new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </span>
        </div>
    `;

    messagesContainer.appendChild(row);
    lastKnownMessages = [...lastKnownMessages, message];
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

async function refreshMessages() {
    try {
        const response = await fetch(`/chat/poll/${id}`);

        if (!response.ok) {
            return;
        }

        const messages = await response.json();
        const newMessages = getNewMessages(lastKnownMessages, messages);

        if (newMessages.length > 0) {
            newMessages.forEach((message) => addMessage(message));
            scrollToBottom();
        }

        lastKnownMessages = messages;
    } catch (err) {
        console.error(err);
    }
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

scrollToBottom();
setInterval(refreshMessages, 4000);
