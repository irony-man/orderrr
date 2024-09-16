# Standard Library

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import CharField, FloatField
from django.utils.translation import gettext as _


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


class PositiveFloatField(FloatField):
    default_validators = [MinValueValidator(0.0)]
    description = _("Positive field")
