from flask import Flask, request
from db_handler import DatabaseHandler

app = Flask(__name__)
db_handler = DatabaseHandler("db/db_files/data.db")


@app.route("/contacts", methods=["POST"])
def add_contact():
    db_handler.add_record("Contacts", **request.json)
    return {"PhoneNumber": request.json["PhoneNumber"]}, 201


@app.route("/contacts/<string:PhoneNumber>", methods=["DELETE"])
def delete_contact(PhoneNumber):
    db_handler.remove_record("Contacts", PhoneNumber, id_column="PhoneNumber")
    return "", 204


@app.route("/contacts/<string:PhoneNumber>", methods=["PUT"])
def edit_contact(PhoneNumber):
    db_handler.edit_record(
        table_name="Contacts",
        record_id=PhoneNumber,
        id_column="PhoneNumber",
        **request.json
    )
    return "", 204

@app.route("/contacts/<string:PhoneNumber>", methods=["GET"])
def get_contact(PhoneNumber):
    record = db_handler.get_record(
        table_name="Contacts",
        record_id=PhoneNumber,
        id_column="PhoneNumber"
    )
    if record is None:
        return "Record not found", 404
    else:
        return f"{record}", 200



if __name__ == "__main__":
    app.run(debug=True)
