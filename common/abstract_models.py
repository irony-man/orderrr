# Standard Library
import uuid

import requests
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator
from django.db.models import (
    CharField,
    DateTimeField,
    FloatField,
    IntegerField,
    JSONField,
    Model,
    TextField,
    UUIDField,
)
from django_countries.fields import CountryField
from loguru import logger


class CreateUpdate(Model):
    uid = UUIDField(default=uuid.uuid4, unique=True)
    created = DateTimeField(auto_now_add=True)
    updated = DateTimeField(auto_now=True)

    class Meta:
        abstract = True
