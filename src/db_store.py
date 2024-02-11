import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('data.db')
c = conn.cursor()

# Create table if not exists
c.execute('''
    CREATE TABLE IF NOT EXISTS Contacts (
        PhoneNumber TEXT,
        Name TEXT,
        Messages TEXT,
        Timeout INTEGER
    )
''')

# Insert a row of data
c.execute("INSERT INTO Contacts VALUES ('1234567890','John Doe','Hello;How are you?',30)")

# Save (commit) the changes
conn.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
conn.close()
