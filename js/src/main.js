const Contact = require("./contact.js");
const load_db = require("./db_handler.js");
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client();
const ONE_DAY_IN_MS = 60 * 1000 * 60 * 24; // 24 hours in milliseconds

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
  setInterval(checkInactivity, ONE_DAY_IN_MS);
});

async function checkInactivity() {
  const contacts = await load_contacts();
  console.log(contacts);

  const tasks = contacts.map(async (contact) => {
    const id = `${contact.phoneNumber}@c.us`;
    const chat = await client.getChatById(id);
    const messages = await chat.fetchMessages({ limit: 1 });

    if (messages.length > 0) {
      const lastMessage = messages[0];
      const daysInactive =
        (Date.now() - lastMessage.timestamp * 1000) / ONE_DAY_IN_MS;

      if (daysInactive > contact.timeout) {
        const randomIndex = Math.floor(Math.random() * contact.message_list.length);
        chat.sendMessage(contact.message_list[randomIndex]);
      }
    }
  });

  await Promise.all(tasks);
}

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

client.initialize();
