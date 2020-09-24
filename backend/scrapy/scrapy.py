import csv
from datetime import datetime
import traceback
import requests
import mysql.connector
import json


def close_conn(conn, cursor):
    # close the connection
    if cursor:
        cursor.close()
    if conn:
        conn.close()


def get_conn():
    conn = mysql.connector.connect(host="localhost", user="admin", password="admin", database="covid19")
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


def fetch_who_data():
    details = []
    total = {}
    WHO_URL = 'https://covid19.who.int/WHO-COVID-19-global-data.csv'
    with requests.Session() as s:
        download = s.get(WHO_URL)
        decoded_content = download.content.decode('utf-8-sig')
        cr = csv.reader(decoded_content.splitlines(), delimiter=',')
        my_list = list(cr)
        column_header = my_list[0]
        time_index = 0
        last_update_time = get_last_update_time("history")
        print("last_update time in table history is:",last_update_time)
        for i in range(1, len(my_list)):
            if last_update_time != None and datetime.strptime(my_list[i][time_index], '%Y-%m-%d') <= last_update_time:
                continue
            else:
                details.append(tuple(my_list[i]))
    return column_header, details


def fetch_au_data():
    content_dict = {}
    AU_URL = 'https://services1.arcgis.com/vHnIGBHHqDR6y0CR/arcgis/rest/services/COVID19_Time_Series/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'
    with requests.Session() as s:
        download = s.get(AU_URL)
        decoded_content = download.content.decode('utf-8')
        content_dict = json.loads(decoded_content)
    return content_dict['features']

def update_details():
    cursor = None
    conn = None
    try:
        column_header, details = fetch_who_data()
        conn, cursor = get_conn()
        if (len(column_header) != 8):
            print("The structure of WHO .csv has changed, need handwork")
            return;
        last_update_time = get_last_update_time("history")
        query = f'create table if not exists details (Id int(11) not null auto_increment primary key,' \
                f'{column_header[0].lower()} datetime,' \
                f'{column_header[1].lower()} varchar(100),' \
                f'{column_header[2].lower()} varchar(100),' \
                f'{column_header[3].lower()} varchar(100),' \
                f'{column_header[4].lower()} int(11),' \
                f'{column_header[5].lower()} int(11),' \
                f'{column_header[6].lower()} int(11),' \
                f'{column_header[7].lower()} int(11))'
        cursor.execute(query)
        if len(details) != 0 and last_update_time != None:
            delete_query = f'delete from details where date_reported>"{last_update_time.strftime("%Y-%m-%d")}"'
            cursor.execute(delete_query)
            conn.commit()
            print(cursor.rowcount, "was deleted from table details.")
        insert_query = 'insert into details values (null,%s,%s,%s,%s,%s,%s,%s,%s)'
        cursor.executemany(insert_query, details)
        conn.commit()
        print(cursor.rowcount, "was inserted to table details.")
    except:
        traceback.print_exc()
    finally:
        close_conn(conn, cursor)


def update_history():
    cursor = None
    conn = None
    try:
        column_header = fetch_who_data()[0]
        if (len(column_header) != 8):
            print("The structure of WHO .csv has changed, need handwork")
            return;
        conn, cursor = get_conn()
        history = []
        query = f'create table if not exists history (Id int(11) not null auto_increment primary key,' \
                f'{column_header[0].lower()} datetime,' \
                f'{column_header[4].lower()} int(11),' \
                f'{column_header[5].lower()} int(11),' \
                f'{column_header[6].lower()} int(11),' \
                f'{column_header[7].lower()} int(11))'
        cursor.execute(query)
        conn.commit()
        last_update_time = get_last_update_time("history")
        # delete partial data before insert new data
        if last_update_time != None:
            delete_query = f'delete from history where date_reported >"{last_update_time.strftime("%Y-%m-%d")}"'
            cursor.execute(delete_query)
            print(cursor.rowcount, "deleted from history")
            conn.commit()
        sum_query = "select date_reported, sum(new_cases),sum(cumulative_cases),sum(new_deaths),sum(cumulative_deaths) " \
                    "from details ";
        if last_update_time != None:
            sum_query = f'{sum_query} where date_reported >"{last_update_time.strftime("%Y-%m-%d")}"'
        sum_query = sum_query + "group by date_reported"
        cursor.execute(sum_query)
        # cursor.execute(sum_query,last_update_time)
        history = cursor.fetchall()
        insert_query = 'insert into history values (null,%s,%s,%s,%s,%s)'
        cursor.executemany(insert_query, history)
        conn.commit()
        print(cursor.rowcount, "was inserted to table history.")
    except:
        traceback.print_exc()
    finally:
        close_conn(conn, cursor)


def makeQueries(one_row):
    create_queries = ['', '', '']
    insert_queries = ['', '', '']
    for item in one_row.keys():
        insert_column = f'%s,'
        column = f'{item.lower()} int(11),'
        if ("deaths" in item.lower()):
            create_queries[1] += column
            insert_queries[1] += insert_column
        elif ("tests" in item.lower()):
            create_queries[2] += column
            insert_queries[2] += insert_column
        elif (item.lower() == 'date'):
            column = f'date_reported bigint,'
            for i in range(len(create_queries)):
                create_queries[i] += column
                insert_queries[i] += insert_column
        else:
            create_queries[0] += column
            insert_queries[0] += insert_column
    return create_queries, insert_queries


def collectInsertData(details):
    datas = [[], [], []]
    au_last_update_time = get_au_update_time()
    for item in details:
        one_confirmed_row = []
        one_deaths_row = []
        one_tests_row = []
        if au_last_update_time!=None and item['attributes']['Date'] <= au_last_update_time:
            continue;
        for (key, value) in item['attributes'].items():
            if (value == None):
                value = 0
            if ("deaths" in key.lower()):
                one_deaths_row.append(value)
            elif ("tests" in key.lower()):
                one_tests_row.append(value)
            elif (key.lower() == 'date'):
                one_confirmed_row.append(value)
                one_deaths_row.append(value)
                one_tests_row.append(value)
            else:
                one_confirmed_row.append(value)
        datas[0].append(tuple(one_confirmed_row))
        datas[1].append(tuple(one_deaths_row))
        datas[2].append(tuple(one_tests_row))
    return datas


def update_au_details():
    cursor = None
    conn = None
    try:
        details = fetch_au_data()
        # details = response['features']

        create_queries, insert_queries = makeQueries(details[0]['attributes'])
        insertDatas = collectInsertData(details)

        conn, cursor = get_conn()
        tables_names = ['au_confirmed', 'au_deaths', 'au_tests']

        for i in range(len(tables_names)):
            query_header = f'create table if not exists {tables_names[i]} (id int(11) not null auto_increment primary key,'
            query_end = ")"
            query = query_header + create_queries[i].strip(',') + query_end
            cursor.execute(query)
            conn.commit()
        for i in range(len(tables_names)):
            query_header = f'insert into {tables_names[i]} values (null,'
            query_end = ")"
            query = query_header + insert_queries[i].strip(',') + query_end
            cursor.executemany(query, insertDatas[i])
            conn.commit()
            print(cursor.rowcount, f' was inserted to {tables_names[i]}.')
        print("au tables update ends")
    except:
        traceback.print_exc()
    finally:
        close_conn(conn, cursor)


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


if __name__ == "__main__":
    update_details()
    update_history()
    update_au_details()
    print('end')
