const { Pool } = require("pg");

const pool = new Pool();

(async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL
    );
  `);
})();

module.exports = {
    async getMessages() {
        const res = await pool.query("SELECT * FROM messages ORDER BY id DESC");
        return res.rows;
    },

    async saveMessage(content) {
        if (!content || typeof content !== "string") {
            throw new Error("Invalid message content");
        }
        await pool.query("INSERT INTO messages (content) VALUES ($1)", [content]);
    },
};
