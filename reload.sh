#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
# rm -rf common/migrations
# rm -rf db.sqlite3
# ./manage.py makemigrations common
# ./manage.py migrate
cd common/static_dev/common
npm i --legacy-peer-deps
npm run build
cd ../../../
./manage.py collectstatic --no-input
./manage.py migrate
echo "from django.contrib.auth import get_user_model; User = get_user_model(); user = User.objects.create_superuser('shivam', '', '123'); from common.models import UserProfile; UserProfile.objects.create(user=user)" | python manage.py shell
