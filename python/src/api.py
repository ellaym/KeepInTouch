from flask import Flask, request
from db_handler import DatabaseHandler
import json

app = Flask(__name__)
db_handler = DatabaseHandler("db/db_files/data.db")


@app.route("/contacts", methods=["POST"])
def add_contact():
    db_handler.add_record("Contacts", **request.json)
    return json.dumps({"PhoneNumber": request.json["PhoneNumber"]}), 201


@app.route("/contacts/<string:PhoneNumber>", methods=["DELETE"])
def delete_contact(PhoneNumber):
    db_handler.remove_record("Contacts", PhoneNumber, id_column="PhoneNumber")
    return json.dumps({}), 204


@app.route("/contacts/<string:PhoneNumber>", methods=["PUT"])
def edit_contact(PhoneNumber):
    db_handler.edit_record(
        table_name="Contacts",
        record_id=PhoneNumber,
        id_column="PhoneNumber",
        **request.json,
    )
    return json.dumps({}), 204


@app.route("/contacts/<string:PhoneNumber>", methods=["GET"])
def get_contact(PhoneNumber):
    if PhoneNumber == "הכל":
        records = db_handler.get_all_records(table_name="Contacts")
        if records is None:
            return json.dumps({"result": "No records found"}), 404
        else:
            return (
                json.dumps({f"item {i}": records[i] for i, _ in enumerate(records)}),
                200,
            )
    else:
        record = db_handler.get_record(
            table_name="Contacts", record_id=PhoneNumber, id_column="PhoneNumber"
        )

        if record is None:
            return json.dumps({"verdict": "Record not found"}), 404
        else:
            return (
                json.dumps(
                    {
                        "phoneNumber": record[0],
                        "Name": record[1],
                        "Messages": record[2],
                        "Timeout": record[3],
                    }
                ),
                200,
            )


if __name__ == "__main__":
    app.run(debug=True)
