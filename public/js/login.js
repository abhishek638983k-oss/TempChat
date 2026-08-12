const loginForm = document.getElementById("loginForm");
const registerBtn = document.getElementById("registerBtn");
const message = document.getElementById("message");

// LOGIN
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            message.textContent = "Login successful!";
            window.location.href = "/home";
        } else {
            message.textContent = data.msg || "Invalid username or password";
        }
    } catch (error) {
        console.error(error);
        message.textContent = "Something went wrong.";
    }
});

// REGISTER
registerBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
        message.textContent = "Enter username and password first.";
        return;
    }

    try {
        const response = await fetch("/login/register", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            message.textContent = "Registration successful! You Can Login !";
        } else {
            message.textContent = data.msg || "Registration failed.";
        }
    } catch (error) {
        message.textContent = "Something went wrong.";
    }
});
