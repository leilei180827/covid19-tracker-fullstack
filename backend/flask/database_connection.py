import traceback
import mysql.connector

def close_conn(conn, cursor):
    # close the connection
    if cursor:
        cursor.close()
    if conn:
        conn.close()

def get_conn():
    conn = mysql.connector.connect(host="localhost", user="xxx", password="xxx", database="covid19")
    cursor = conn.cursor()
    return conn, cursor

def get_last_update_time(table_name):
    cursor = None
    conn = None
    last_update_time = None
    try:
        conn, cursor = get_conn()
        query = f"select date_reported from history where cumulative_cases=(select max(cumulative_cases) from history)"
        search_count = cursor.execute(query)
        last_update_time = cursor.fetchone()
    except:
        traceback.print_exc()
    finally:
        close_conn(conn, cursor)
        if (last_update_time != None):
            return last_update_time[0]
        return last_update_time

def get_au_update_time():
    cursor = None
    conn = None
    au_update_time = None
    try:
        conn, cursor = get_conn()
        query = f"select max(date_reported) from au_confirmed"
        search_count = cursor.execute(query)
        au_update_time = cursor.fetchone()
    except:
        traceback.print_exc()
    finally:
        close_conn(conn, cursor)
        if (au_update_time != None):
            return au_update_time[0]
        return au_update_time
