const sqlite3 = require("sqlite3").verbose();

function load_db(db_path, sql_query) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(db_path, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      console.log("Connected to the database.");
    });

    db.all(sql_query, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });

    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Close the database connection.");
    });
  });
}

module.exports = load_db;
