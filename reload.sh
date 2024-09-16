#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
rm -rf common/migrations
rm -rf sql_lite.db
./manage.py makemigrations common
./manage.py migrate
./manage.py collectstatic --no-input
./manage.py migrate
# echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('shivam', '', '123')" | python manage.py shell
