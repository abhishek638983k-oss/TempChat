import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDB() {
    const mongoUri =
        process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/test";
    await mongoose.connect(mongoUri);
}
