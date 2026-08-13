import express from "express";
import connectDB from "./config/db.js";
import chatRoute from "./routes/chat.js";
import reqRoute from "./routes/request.js";
import loginRoute from "./routes/login.js";
import homeRoute from "./routes/home.js";
import apiRoute from "./routes/api.js";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import authenticateToken from "./middleware/authenticate.js";
import logoutRoute from "./routes/logout.js";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views");

await connectDB()
    .then(() => console.log("Mongoose : DB connected..."))
    .catch((err) => console.log(err));

app.use("/chat", chatRoute);
app.use("/request", reqRoute);
app.use("/api", apiRoute);
app.use("/login", loginRoute);
app.use("/home", homeRoute);
app.use("/logout", logoutRoute);

app.get("/", authenticateToken, (req, res) => {
    res.redirect("/home");
});

app.use((req, res) => {
    res.send("route does not exists");
});

app.listen(port, "0.0.0.0", (error) => {
    error
        ? console.log(error.message)
        : console.log(`Server is running... \nhttp://localhost:${port}/`);
});
