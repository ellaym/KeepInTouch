// Define the base URL
const url = "http://localhost:5000/contacts";

async function handleMessage(message) {
  // Split the message into lines
  let lines = message.split("\n");

  // The first line is the command
  let command = lines[0];

  // The rest of the lines are the fields
  let fields = lines.slice(1);
  let result_json = {};

  // Depending on the command, we call a different handler
  switch (command) {
    case "הוסף":
      result_json = await handleAdd(fields);
      return JSON.stringify(result_json);
    case "מחק":
      result_json = await handleDelete(fields);
      return JSON.stringify(result_json);
    case "עדכן":
      result_json = await handleEdit(fields);
      return JSON.stringify(result_json);
    case "שלוף":
      result_json = await handleGet(fields);
      return convertToJsonStringWithNewlines(result_json);
    default:
      console.log(`Unknown command: ${command}`);
  }
}

async function handleAdd(fields) {
  // Parse the fields for the ADD command
  let phoneNumber = fields[0];
  let name = fields[1];
  let messages = fields[2].split(",");
  let timeout = fields[3];

  // Call the add handler with the parsed fields
  return await addHandler(name, phoneNumber, messages, timeout);
}

async function handleDelete(fields) {
  // Parse the fields for the DELETE command
  let phoneNumber = fields[0];

  // Call the delete handler with the parsed fields
  return await deleteHandler(phoneNumber);
}

async function handleEdit(fields) {
  // Parse the fields for the EDIT command
  let phoneNumber = fields[0];
  let name = fields[1];
  let messages = fields[2].split(",");
  let timeout = fields[3];

  // Call the edit handler with the parsed fields
  return await editHandler(name, phoneNumber, messages, timeout);
}

async function handleGet(fields) {
  // Parse the fields for the GET command
  let phoneNumber = fields[0];

  // Call the get handler with the parsed fields
  return await getHandler(phoneNumber);
}

async function addHandler(name, phoneNumber, messages, timeout) {
  // Create the data object
  let data = {
    PhoneNumber: phoneNumber,
    Name: name,
    Messages: messages.join(";"),
    Timeout: timeout,
  };

  // Send a POST request
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      return "Success handling POST";
    })
    .catch((error) => {
      console.error("Error:", error);
      return "Error handling POST " + error;
    });
}

async function deleteHandler(phoneNumber) {
  // Send a DELETE request
  return fetch(`${url}/${phoneNumber}`, {
    method: "DELETE",
  })
    .then((response) => {
      console.log("Success:", response.status);
      return "Success handling DELETE";
    })
    .catch((error) => {
      console.error("Error:", error);
      return "Error handling DELETE " + error;
    });
}

async function editHandler(name, phoneNumber, messages, timeout) {
  // Create the data object
  let data = {
    PhoneNumber: phoneNumber,
    Name: name,
    Messages: messages.join(";"),
    Timeout: timeout,
  };

  // Send a PUT request
  return fetch(`${url}/${phoneNumber}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log("Success:", response.status);
      return "Success handling PUT";
    })
    .catch((error) => {
      console.error("Error:", error);
      return "Error handling PUT " + error;
    });
}

async function getHandler(phoneNumber) {
  // Send a GET request
  return fetch(`${url}/${phoneNumber}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      return "Could not get the data";
    });
}

async function convertToJsonStringWithNewlines(data) {
  return (
    Object.entries(data)
      .map(([key, value]) => {
        return `${key}: '${value}'`;
      })
      .join("\n")
  );
}

module.exports = handleMessage;
