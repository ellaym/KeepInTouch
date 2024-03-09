const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

function loadSQLDatabase(db_path, sql_query) {
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

function loadJsonFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading the file:", err);
        reject(err); // Reject the promise on error
      } else {
        try {
          const jsonObj = JSON.parse(data);
          resolve(jsonObj); // Resolve the promise with the JSON object
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          reject(parseError); // Reject the promise on parsing error
        }
      }
    });
  });
}

module.exports = { loadSQLDatabase, loadJsonFile };
