const { Contact } = require("./contact.js");
const load_db = require("./db_handler.js");
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client();

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
  // Start checking for inactivity every minute
  setInterval(checkInactivity, 60 * 1000);
});

async function checkInactivity() {
  load_contacts();

  let phoneNumber = "972524542500"; // replace with the phone number of the specific contact
  let id = `${phoneNumber}@c.us`;
  let chat = await client.getChatById(id);
  let messages = await chat.fetchMessages({ limit: 1 });
  if (messages.length > 0) {
    let lastMessage = messages[0];
    let daysInactive =
      (Date.now() - lastMessage.timestamp * 1000) / (1000 * 60 * 60 * 24);
    let X = 7; // replace X with the number of days
    if (daysInactive > X) {
      chat.sendMessage("Hello, it's been a while since we last talked.");
    }
  }
}

function load_contacts() {
  let sql = `SELECT PhoneNumber phoneNumber,
    Name name,
    Messages messages,
    Timeout timeout
    FROM Contacts`;

  let contacts = load_db("resources/data.db", sql);
  contacts.forEach((contact) => {
    let c = new Contact(
      contact.name,
      contact.phoneNumber,
      contact.messages.split(";"),
      contact.timeout
    );
    console.log(c);
  });
}

client.initialize();
