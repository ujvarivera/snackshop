const Database = require('better-sqlite3');
const db = new Database('snackshop.db');

db.prepare(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        currency TEXT NOT NULL,
        stock INTEGER NOT NULL
    )
`).run();

module.exports = db;
