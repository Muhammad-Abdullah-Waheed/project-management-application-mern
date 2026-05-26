import dotenv from "dotenv";

dotenv.config();

import { validateEnv } from "./libs/env.js";

validateEnv();

import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";

import { closeEmailQueue } from "./libs/email-queue.js";
import router from "./routes/index.js";

function getCorsOrigin() {
    const raw = process.env.FRONTEND_URL || "http://localhost:5173";
    const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (list.length <= 1) {
        return list[0] || "http://localhost:5173";
    }
    return (origin, callback) => {
        if (!origin || list.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    };
}

const app = express();

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);

app.use(
    cors({
        origin: getCorsOrigin(),
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(
    morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB DataBase."))
    .catch((error) => console.log(error));

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the backend" });
});

app.get("/health", (req, res) => {
    const dbOk = mongoose.connection.readyState === 1;
    res.status(dbOk ? 200 : 503).json({
        ok: dbOk,
        database: dbOk ? "connected" : "disconnected",
    });
});

app.use("/v1/", router);

app.use((req, res) => {
    res.status(404).json({ message: "Resource not found" });
});

app.use((err, req, res, _next) => {
    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({ message: "Forbidden" });
    }
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
    console.log(`Backend running on port ${PORT}`)
);

async function shutdown(signal) {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
        try {
            await mongoose.connection.close();
            await closeEmailQueue();
            process.exit(0);
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    });
    setTimeout(() => process.exit(1), 10_000).unref();
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
