### cmd to enter the directory where your scrapy python file locates
cd /home/xxx/xxx
### activate virtual environment
source xxx/bin/activate
### execute the scrapy python file&&write 'print' to log file
python spider.py > scrapy.log 2>&1 &
### deactivate the virtual environment
deactivate

### some other infos may help
### set a clock to execute scrapy 
### in linux server: crontab cmd is to set a task clock 
### like 0 */6 * * * /home/task_spider.sh(shell file address)
### * * * * * represents min/hour/day/month/year

### selinux
### in default, sestatus is enabled and current moding is enforcing;
### you may need to disable selinux temporarily to allow the server active by 'sudo setenforece 0' 