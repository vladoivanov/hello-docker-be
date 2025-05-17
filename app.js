const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/messages", async (req, res) => {
    try {
        const messages = await db.getMessages();
        res.status(200).json(messages);
    } catch (err) {
        console.error("GET /messages error:", err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

app.post("/submit", async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
        return res.status(400).json({ error: "Message is required and must be a non-empty string" });
    }

    try {
        await db.saveMessage(message.trim());
        res.status(201).json({ status: "ok" });
    } catch (err) {
        console.error("POST /submit error:", err);
        res.status(500).json({ error: "Failed to save message" });
    }
});

module.exports = app;
