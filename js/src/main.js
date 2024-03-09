const Contact = require("./contact.js");
const { loadSQLDatabase, loadJsonFile } = require("./db_handler.js");
const handleMessage = require("./command_handler.js");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const COMMAND_TIMEOUT_MS = 14000; // 8 seconds in ms

async function main() {
  const client = new Client({
    authStrategy: new LocalAuth(),
  });
  const ONE_DAY_IN_MS = 60 * 1000 * 60 * 24; // 24 hours in milliseconds
  let config = {};

  try {
    config = await loadJsonFile("config/config.json");
  } catch (error) {
    console.error("Failed to load the JSON file:", error);
    return -1;
  }

  if (!("db_path" in config) || !("mgmt_phone_number" in config)) {
    console.log(
      "Config file should contain db_path field and mgmt_phone_number field"
    );
    return -1;
  }

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Client is ready!");
    setInterval(checkInactivity, ONE_DAY_IN_MS);
    setInterval(getCommands, COMMAND_TIMEOUT_MS);
  });

  async function checkInactivity() {
    const contacts = await load_contacts();

    const tasks = contacts.map(async (contact) => {
      const id = `${contact.phoneNumber}@c.us`;
      const chat = await client.getChatById(id);
      const messages = await chat.fetchMessages({ limit: 1 });

      if (messages.length > 0) {
        const lastMessage = messages[0];
        const daysInactive =
          (Date.now() - lastMessage.timestamp * 1000) / ONE_DAY_IN_MS;

        if (daysInactive > contact.timeout) {
          const randomIndex = Math.floor(
            Math.random() * contact.message_list.length
          );
          chat.sendMessage(contact.message_list[randomIndex]);
        }
      }
    });

    await Promise.all(tasks);
  }

  async function getCommands() {
    const id = `${config["mgmt_phone_number"]}@c.us`;
    const chat = await client.getChatById(id);
    const messages = await chat.fetchMessages({ limit: 1 });
    const RESULT_PREFIX = "RESULT:\n";

    if (messages.length > 0) {
      const lastMessage = messages[0];
      if (lastMessage.body.slice(0, RESULT_PREFIX.length) != RESULT_PREFIX) {
        try {
          handleMessage(lastMessage.body).then((result) => {
            if (result != null) {
              client.sendMessage(id, RESULT_PREFIX + result);
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  async function load_contacts() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT PhoneNumber phoneNumber,
      Name name,
      Messages messages,
      Timeout timeout
      FROM Contacts`;

      loadSQLDatabase(config["db_path"], sql)
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
}

main();