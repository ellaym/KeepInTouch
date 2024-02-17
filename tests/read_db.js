const load_db = require("../js/src/db_handler.js");
const Contact = require("../js/src/contact.js");

async function load_contacts() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT PhoneNumber phoneNumber,
        Name name,
        Messages messages,
        Timeout timeout
        FROM Contacts`;

    load_db("db/db_files/data.db", sql)
      .then((db_contacts) => {
        const found_contacts = db_contacts.map(
          (contact) =>
            new Contact(
              contact.name,
              contact.phoneNumber,
              contact.messages.split(";"),
              contact.timeout
            )
        );
        resolve(found_contacts);
      })
      .catch((err) => reject(err));
  });
}

// call load contacts and print the result
load_contacts()
  .then((contacts) => {
    console.log(contacts);
  })
  .catch((err) => {
    console.error(err);
  });
