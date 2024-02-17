class Contact{
    constructor(name, phone_number, message_list, timeout) {
        this.name = name;
        this.phoneNumber = phone_number;
        this.message_list = message_list;
        this.timeout = timeout
    }
}

module.exports = Contact;