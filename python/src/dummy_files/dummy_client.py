import requests
import json

# Define the URL of your API
url = "http://localhost:5000/contacts"

# Define the data you want to send
data = {
    "PhoneNumber": "972524542500",
    "Name": "Ori S",
    "Messages": 'שלום זה המנכ"ל?',
    "Timeout": 0,
}

# Send the POST request
# response = requests.post(url, json=data)
# # Print the response
# if response.status_code == 201:
#     print('Contact added successfully')
# else:
#     print('Failed to add contact:', response.text)

# requests.delete(url + '/972524542500')
# requests.put(
#     url + "/972524542500",
#     json={"Name": "Ori S", "Messages": 'עודכן זה המנכ"ל?', "Timeout": 0},
# )

print(requests.get(url + '/972524542500').text)