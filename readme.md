Try it at 35.201.4.157 -a GCP compute engine linux VM
(gunicorn and nginx)

###

A fullstack project to monitor the circumstance of covid-19 globally and in Australia

##

The backend basically is a Flask project to extract data from mysql and provide APIs.
and there is a scrapy process running twice everyday in order to collect latest pandemic record and store into mysql.
To access to mysql, you need to put your specific your database info and make a change to mysql connector in database_connection.py and scrapy.py;

##

The frontend is a React project working with echarts visualizing covid19 trend by map,line,bar.
