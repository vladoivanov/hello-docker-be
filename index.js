const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;
const db = new Pool();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

(async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL
        );
    `);
})();

// API: вземи всички съобщения
app.get("/messages", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM messages ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// API: добави съобщение
app.post("/submit", async (req, res) => {
    const message = req.body.message;
    try {
        await db.query("INSERT INTO messages (content) VALUES ($1)", [message]);
        res.status(201).json({ status: "ok" });
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
