import sqlite3


class DatabaseHandler:
    def __init__(self, db_path):
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.cursor = self.conn.cursor()

    def add_record(self, table_name, **kwargs):
        columns = ", ".join(kwargs.keys())
        placeholders = ", ".join("?" * len(kwargs))
        sql = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        self.cursor.execute(sql, tuple(kwargs.values()))
        self.conn.commit()

    def get_record(self, table_name, record_id, id_column="id"):
        sql = f"SELECT * FROM {table_name} WHERE {id_column} = ?"
        self.cursor.execute(sql, (record_id,))
        return self.cursor.fetchone()

    def get_all_records(self, table_name):
        sql = f"SELECT * FROM {table_name};"
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def edit_record(self, table_name, record_id, id_column="id", **kwargs):
        columns = ", ".join(f"{k} = ?" for k in kwargs.keys())
        sql = f"UPDATE {table_name} SET {columns} WHERE {id_column} = ?"
        self.cursor.execute(sql, (*kwargs.values(), record_id))
        self.conn.commit()

    def remove_record(self, table_name, record_id, id_column="id"):
        sql = f"DELETE FROM {table_name} WHERE {id_column} = ?"
        self.cursor.execute(sql, (record_id,))
        self.conn.commit()
