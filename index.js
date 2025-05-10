const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;
const db = new Pool();

app.use(express.urlencoded({ extended: false }));

(async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                content TEXT NOT NULL
            );
        `);
        console.log("✅ Table 'messages' is ready.");
    } catch (err) {
        console.error("❌ Failed to create table:", err);
        process.exit(1);
    }
})();

app.post("/submit", async (req, res) => {
    const { message } = req.body;
    try {
        await db.query("INSERT INTO messages (content) VALUES ($1)", [message]);
        console.log("User submitted:", message);
        res.send(`<p>You wrote: ${message}</p><a href="/">Back</a>`);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).send("Database error");
    }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
