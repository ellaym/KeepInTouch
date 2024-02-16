const sqlite3 = require("sqlite3").verbose();

function load_db(db_path, sql_query) {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(db_path, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      console.log("Connected to the database.");
    });

    let output_rows = [];

    db.all(sql_query, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      rows.forEach((row) => {
        output_rows.push(row);
      });
      resolve(output_rows);
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
