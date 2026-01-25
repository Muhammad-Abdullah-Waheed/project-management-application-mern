import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import router from "./routes/index.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(morgan("dev"));

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB DataBase."))
    .catch((error) => console.log(error));

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the backend" });
})



app.use('/v1/', router);



app.use((req, res) => {
    res.status(404).json({ message: "Resource not found" });
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
