const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messagesContainer = document.getElementById("messages");

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

        // Add message to UI
        addMessage(data);

        // Clear input
        messageInput.value = "";

        // Scroll to bottom
        scrollToBottom();
    } catch (err) {
        console.error(err);
    }
}

function addMessage(message) {
    const row = document.createElement("div");

    row.classList.add("message-row", "sent");

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
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Open chat at bottom
scrollToBottom();
