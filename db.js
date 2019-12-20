const sqlite3 = require('sqlite3').verbose();

const DB_PATH = 'app.db'

const DB = new sqlite3.Database(DB_PATH);

DB.serialize(() => {
    DB.run("CREATE TABLE IF NOT EXISTS messages (key INT PRIMARY KEY UNIQUE,username TEXT, message TEXT)");
})

module.exports = DB; 