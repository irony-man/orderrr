# # Standard Library
# import functools
# import io
# import os
# import uuid
# from datetime import timedelta
# from decimal import Decimal
# from platform import machine
# from typing import Any, Callable, Collection, Dict, List, Optional

import requests
import pgeocode
# import bcrypt
# import pgeocode
# from django.conf import settings
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import (
    MaxValueValidator,
    MinLengthValidator,
    MinValueValidator,
)

# from django.db import IntegrityError
from django.db.models import (
    CASCADE,
    PROTECT,
    BooleanField,
    CharField,
    DateField,
    DateTimeField,
    EmailField,
    F,
    FileField,
    FloatField,
    ForeignKey,
    GeneratedField,
    ImageField,
    Index,
    IntegerField,
    JSONField,
    ManyToManyField,
    Model,
    OneToOneField,
    OuterRef,
    PositiveIntegerField,
    Q,
    QuerySet,
    Subquery,
    Sum,
    TextField,
    UniqueConstraint,
    URLField,
    UUIDField,
)
from django_countries.fields import CountryField
from loguru import logger

from common.abstract_models import CreateUpdate
from common.custom_fields import PercentField, PositiveFloatField
from common.model_helpers import random_pin
from common.taxonomies import DesignType


class UserProfile(CreateUpdate):
    user = OneToOneField(to=User, on_delete=PROTECT)
    display_picture = ImageField(blank=True, null=True)
    email_otp = PositiveIntegerField(
        validators=[MaxValueValidator(999999), MinValueValidator(100000)],
        default=random_pin,
    )
    email_otp_sent = DateTimeField(null=True, blank=True)
    email_verified = BooleanField(default=False)

    def __str__(self):
        return f"{self.full_name} / {self.user}"

    @property
    def full_name(self):
        return self.user.get_full_name()

    # def request_password_reset(self):
    #     now = timezone.now()
    #     delta = now - timedelta(minutes=10)
    #     recent = PasswordResetRequest.objects.filter(
    #         user=self.user, created__range=(delta, now)
    #     )
    #     if recent.exists():
    #         logger.info("Request less than 10 minutes old exists.")
    #         return
    #     PasswordResetRequest.objects.create(user=self.user)


class Design(CreateUpdate):
    user = ForeignKey(User, on_delete=PROTECT)
    title = CharField(max_length=512)
    image = ImageField()
    base_price = PositiveFloatField()
    discount = PercentField(default=0)
    stock = PositiveIntegerField()
    design_type = CharField(choices=DesignType.choices, max_length=16)
    description = TextField(blank=True)

    def __str__(self):
        return f"{self.title} / {self.base_price} / {self.user}"

    @property
    def final_price(self):
        return self.base_price - (self.base_price * self.discount)


class Order(CreateUpdate):
    user = ForeignKey(User, on_delete=PROTECT)
    designs = ManyToManyField(Design)
    price_paid = PositiveFloatField()
    discount = PercentField(default=0)

    def __str__(self):
        return f"{self.price_paid} / {self.user}"

    # def clean(self):
    #     for design in self.designs:
    #         if self.user == design.user:
    #             raise ValidationError({"design": "User can't order it's own design."})


class Cart(CreateUpdate):
    user = ForeignKey(User, on_delete=PROTECT)
    design = ForeignKey(Design, on_delete=PROTECT)

    def __str__(self):
        return f"{self.design} / {self.user}"

    class Meta:
        unique_together = (("user", "design"),)

    def clean(self) -> None:
        if self.design.user == self.user:
            raise ValidationError(
                {"design": "You can't add your own design to cart."}
            )


class WishList(CreateUpdate):
    user = ForeignKey(User, on_delete=PROTECT)
    design = ForeignKey(Design, on_delete=PROTECT)

    def __str__(self):
        return f"{self.design} / {self.user}"

    class Meta:
        unique_together = (("user", "design"),)

    def clean(self) -> None:
        if self.design.user == self.user:
            raise ValidationError(
                {"design": "You can't add your own design to cart."}
            )


class Card(CreateUpdate):
    user = ForeignKey(to=User, on_delete=PROTECT)
    name = CharField(max_length=512)
    card_number = CharField(max_length=16)
    name_on_card = CharField(max_length=512)
    card_expiry = DateField()

    def __str__(self):
        return f"{self.card_number} / {self.user}"

    def save(self, **kwargs):
        self.card_expiry = self.card_expiry.replace(day=1)
        super(Card, self).save(**kwargs)


class Address(CreateUpdate):
    user = ForeignKey(to=User, on_delete=PROTECT)
    address_line = TextField()
    postal_code = IntegerField(blank=True, null=True)
    city = CharField(max_length=255, blank=True)
    state = CharField(max_length=255, blank=True)
    country = CharField(
        max_length=2, choices=list(CountryField().choices), default="IN"
    )

    def __str__(self):
        return f"{self.address_line} / {self.postal_code}"

    @property
    def country_display(self):
        return self.get_country_display()

    def clean(self):
        country_data = pgeocode.Nominatim(self.country)
        postal_data = country_data.query_postal_code(self.postal_code)
        if isinstance(postal_data["country_code"], float):
            raise ValidationError(
                {
                    "postal_code": "This postal code doesn't exist for this country."
                }
            )
        return self

    def save(self, **kwargs):
        country_data = pgeocode.Nominatim(self.country)
        postal_data = country_data.query_postal_code(self.postal_code)
        self.city = postal_data["county_name"]
        self.state = postal_data["state_name"]
        super(Address, self).save( **kwargs)
