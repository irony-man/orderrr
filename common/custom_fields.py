# Standard Library

from cryptography.fernet import Fernet
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import CharField, FloatField
from django.utils.translation import gettext as _

from orderrr.settings import FIELD_ENCRYPTION_KEY

cipher = Fernet(FIELD_ENCRYPTION_KEY)


class UpperCharField(CharField):
    def get_prep_value(self, value):
        if value:
            return super(UpperCharField, self).get_prep_value(value).upper()
        else:
            return value


class PercentField(FloatField):
    default_validators = [MinValueValidator(0.0), MaxValueValidator(1.0)]
    description = _("Percent field")

    def __init__(self, *args, **kwargs):
        kwargs.setdefault("default", 0)
        super().__init__(*args, **kwargs)


class EncryptField(CharField):
    description = _("Encrypt field")

    def get_prep_value(self, value):
        if value is None:
            return value

        # return super(EncryptField, self).get_prep_value(value).upper()
        return cipher.encrypt(value.encode("utf-8")).decode("utf-8")

    def __init__(self, *args, **kwargs):
        kwargs.setdefault("max_length", 128)
        super().__init__(*args, **kwargs)


class PositiveFloatField(FloatField):
    default_validators = [MinValueValidator(0.0)]
    description = _("Positive field")
