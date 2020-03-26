#!bin/sh
pkill -9 uwsgi
service nginx stop

service nginx start
sudo -u www-data uwsgi ./uwsgi.ini
