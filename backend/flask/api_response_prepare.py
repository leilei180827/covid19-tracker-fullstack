import scrapy
import traceback


def fetch_global():
    cursor = None
    conn = None
    with_column_names = []
    try:
        conn, cursor = scrapy.get_conn()
        # latest valid data
        last_update_time = scrapy.get_last_update_time("history");
        # the latest comprehensive data
        query = f'select date_reported, cumulative_cases,new_cases,cumulative_deaths,new_deaths from history where date_reported<="{last_update_time}"'
        cursor.execute(query)
        columns = cursor.description
        global_data = cursor.fetchall()
        for item in global_data:
            one_row = {}
            for i in range(len(columns)):
                one_row[columns[i][0]] = item[i]
            with_column_names.append(one_row)
        conn.commit()
    except:
        traceback.print_exc()
    finally:
        scrapy.close_conn(conn, cursor)
        return with_column_names


def fetch_countries():
    cursor = None
    conn = None
    with_column_names = []
    log_info = {}
    try:
        conn, cursor = scrapy.get_conn()
        # latest valid data
        last_update_time = scrapy.get_last_update_time("history");
        print(last_update_time)
        log_info['update time'] = last_update_time
        # the latest comprehensive data
        query = f'select country as name,cumulative_cases as value,new_cases,cumulative_deaths,new_deaths from details where date_reported="{last_update_time.strftime("%Y-%m-%d")}"'
        cursor.execute(query)
        columns = cursor.description
        latest_data = cursor.fetchall()
        log_info['query'] = query
        log_info['latest_date'] = len(latest_data)
        for item in latest_data:
            one_row = {}
            for i in range(len(columns)):
                one_row[columns[i][0]] = item[i]
            with_column_names.append(one_row)
        conn.commit()
    except:
        traceback.print_exc()
    finally:
        scrapy.close_conn(conn, cursor)
        with_column_names.append(log_info)
        return with_column_names


def fetch_au_latest():
    cursor = None
    conn = None
    with_column_names = []
    try:
        conn, cursor = scrapy.get_conn()
        # latest valid data
        last_update_time = scrapy.get_au_update_time();
        print(last_update_time)
        # the latest comprehensive data
        query = f'select au_confirmed.date_reported, au_confirmed.total_cases, au_deaths.total_deaths,au_tests.total_tests from au_confirmed  ' \
                f'inner join au_deaths on au_deaths.date_reported=au_confirmed.date_reported ' \
                f'inner join au_tests on au_tests.date_reported=au_confirmed.date_reported ' \
                f'where au_confirmed.date_reported={last_update_time}'
        cursor.execute(query)
        columns = cursor.description
        latest_data = cursor.fetchall()
        for item in latest_data:
            one_row = {}
            for i in range(len(columns)):
                one_row[columns[i][0]] = item[i]
            with_column_names.append(one_row)
        conn.commit()
    except:
        traceback.print_exc()
    finally:
        scrapy.close_conn(conn, cursor)
        return with_column_names


def fetch_au_states():
    cursor = None
    conn = None
    with_column_names = []
    try:
        conn, cursor = scrapy.get_conn()
        # latest valid data
        last_update_time = scrapy.get_au_update_time();
        print(last_update_time)
        # the latest comprehensive data
        query = f'select au_confirmed.date_reported,au_confirmed.vic,au_confirmed.nsw,au_confirmed.nt,au_confirmed.tas,au_confirmed.act,au_confirmed.wa,au_confirmed.sa,au_confirmed.qld,' \
                f'au_deaths.vic_deaths,au_deaths.nsw_deaths,au_deaths.nt_deaths,au_deaths.tas_deaths,au_deaths.act_deaths,au_deaths.wa_deaths,au_deaths.sa_deaths,au_deaths.qld_deaths,' \
                f'au_tests.vic_tests,au_tests.nsw_tests,au_tests.nt_tests,au_tests.tas_tests,au_tests.act_tests,au_tests.wa_tests,au_tests.sa_tests,au_tests.qld_tests ' \
                f'from au_confirmed ' \
                f'inner join au_deaths on au_deaths.date_reported=au_confirmed.date_reported ' \
                f'inner join au_tests on au_tests.date_reported=au_confirmed.date_reported ' \
                f'where au_confirmed.date_reported<={last_update_time} ' \
                f'order by au_confirmed.date_reported'
        cursor.execute(query)
        columns = cursor.description
        latest_data = cursor.fetchall()
        for item in latest_data:
            one_row = {}
            for i in range(len(columns)):
                one_row[columns[i][0]] = item[i]
            with_column_names.append(one_row)
        conn.commit()
    except:
        traceback.print_exc()
    finally:
        scrapy.close_conn(conn, cursor)
        return with_column_names


#
# if __name__ == '__main__':
#     # print(fetch_global());
#     print(fetch_countries()[len(fetch_countries())-1])
