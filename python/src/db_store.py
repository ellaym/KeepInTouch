import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('resources/data.db')
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
c.execute("INSERT INTO Contacts VALUES ('972527034091','Itamar B','הא יא תחת; מה אומר יא נוד?',0)")
c.execute("INSERT INTO Contacts VALUES ('972556601543','Josef S','Hello;How are you?',0)")


# Save (commit) the changes
conn.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
conn.close()
