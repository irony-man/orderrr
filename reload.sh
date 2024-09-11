#!/bin/bash

rm -rf common/migrations
rm -rf sql_lite.db
./manage.py makemigrations common
./manage.py migrate
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('tintin', 'mahesh@lostferry.com', 'pass1234')" | python manage.py shell
