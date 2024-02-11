class Contact{
    constructor(name, phone_numbers, message_list, timeout) {
        this.name = name;
        this.phone_numbers = phone_numbers;
        this.message_list = message_list;
        this.timeout = timeout
    }
}

module.exports = Contact;