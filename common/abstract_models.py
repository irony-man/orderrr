# Standard Library
import uuid

from django.db.models import DateTimeField, Model, UUIDField


class CreateUpdate(Model):
    uid = UUIDField(default=uuid.uuid4, unique=True)
    created = DateTimeField(auto_now_add=True)
    updated = DateTimeField(auto_now=True)

    class Meta:
        abstract = True
