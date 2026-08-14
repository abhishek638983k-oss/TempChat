const addFriendForm = document.getElementById("addFriendForm");
const usernameInput = document.getElementById("username");
const message = document.getElementById("message");
const friendsList = document.getElementById("friendsList");
const requestBtn = document.getElementById("requestBtn");
const requestDropdown = document.getElementById("requestDropdown");

loadFriends();
setInterval(loadFriends, 10000);

addFriendForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();

    if (!username) return;

    const response = await fetch("/request", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
    });

    const data = await response.json();

    message.textContent = data.msg;

    if (response.ok) {
        usernameInput.value = "";
        loadFriends();
    }
});

async function loadFriends() {
    const response = await fetch("/api/friend");

    const json = await response.json();

    const friends = json.friends;
    console.log(friends);
    friendsList.innerHTML = "";
    friends.forEach((friend) => {
        const div = document.createElement("div");

        div.className = "friend";
        div.innerHTML = `
            <div class="friend-main">
                <span class="friend-name">${friend.username}</span>
                <span class="friend-status ${friend.online ? "online" : "offline"}">
                    ${friend.online ? "Online" : "Offline"}
                </span>
            </div>
            <span class="presence-dot ${friend.online ? "online" : "offline"}"></span>
        `;

        div.addEventListener("click", () => {
            window.location.href = `/chat/${friend._id}`;
        });

        friendsList.appendChild(div);
    });
}

requestBtn.addEventListener("click", () => {
    requestDropdown.classList.toggle("show");

    if (requestDropdown.classList.contains("show")) {
        loadRequests();
    }
});

async function loadRequests() {
    const response = await fetch("/request");
    const requests = await response.json();

    requestDropdown.innerHTML = "";

    if (requests.length === 0) {
        requestDropdown.innerHTML = `<p class="empty-request">No requests</p>`;
        return;
    }

    requests.forEach((request) => {
        const div = document.createElement("div");
        div.className = "friend-request";

        div.innerHTML = `
            <span>${request.from.username}</span>
            <button class="confirm-btn">
                Confirm
            </button>
        `;

        const confirmBtn = div.querySelector(".confirm-btn");

        confirmBtn.addEventListener("click", () => {
            handleConfirm(request._id);
        });

        requestDropdown.appendChild(div);
    });
}

async function handleConfirm(requestId) {
    try {
        const response = await fetch(`/request/${requestId}/accept`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        // Reload dropdown so the accepted request disappears
        loadRequests();
    } catch (error) {
        console.error("Error accepting request:", error);
    }
}
