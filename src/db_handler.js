const sqlite3 = require("sqlite3").verbose();

function load_db(db_path, sql_query) {
  let db = new sqlite3.Database(db_path, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the database.");
  });

  let output_rows = [];

  db.all(sql_query, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      output_rows.push(row);
    });
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });

  return output_rows;
}

module.exports = load_db;
