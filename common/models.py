# # Standard Library
# import functools
# import io
# import os
# import uuid
# from datetime import timedelta
# from decimal import Decimal
# from platform import machine
# from typing import Any, Callable, Collection, Dict, List, Optional

import pgeocode
from cloudinary import uploader

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
    PROTECT,
    BooleanField,
    CharField,
    DateField,
    DateTimeField,
    FileField,
    ForeignKey,
    ImageField,
    IntegerField,
    JSONField,
    ManyToManyField,
    OneToOneField,
    PositiveIntegerField,
    TextField,
)
from django_countries.fields import CountryField

from common.abstract_models import CreateUpdate
from common.custom_fields import PercentField, PositiveFloatField
from common.model_helpers import (
    default_image_response,
    get_thumbnail_url,
    random_pin,
)
from common.taxonomies import DesignType
from orderrr.settings import DISCOUNT_FEE, DISCOUNT_FEE_APPLICABLE_ON


class UserProfile(CreateUpdate):
    user = OneToOneField(to=User, on_delete=PROTECT)
    display_picture = ImageField(blank=True, null=True)
    display_picture_response = JSONField(
        default=default_image_response, blank=True, null=True
    )
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

    @property
    def display_picture_url(self):
        return self.display_picture_response.get("url", None)

    def save(self, **kwargs):
        if self.display_picture:
            self.display_picture_response = uploader.upload(
                file=self.display_picture,
                transformation=[
                    {
                        "width": 200,
                        "height": 200,
                        "crop": "fill",
                        "gravity": "face",
                    }
                ],
                public_id=str(self.uid),
                overwrite=True,
                folder="Orderrr-v2/Users",
            )
        else:
            if self.display_picture_response.get(
                "public_id", None
            ) != default_image_response().get("public_id", None):
                uploader.destroy(public_id=f"Orderrr-v2/Users/{str(self.uid)}")
            self.display_picture_response = default_image_response()
        super(UserProfile, self).save(**kwargs)

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
    image_response = JSONField(default=dict, blank=True)
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

    @property
    def image_url(self):
        return self.image_response.get("url", None)

    @property
    def image_thumbnail_url(self):
        return get_thumbnail_url(self.image_url)

    def save(self, **kwargs):
        if self.image:
            self.image_response = uploader.upload(
                file=self.image,
                public_id=str(self.uid),
                overwrite=True,
                folder="Orderrr-v2/Designs",
            )
        else:
            if public_id := self.image_response.get("public_id", None):
                uploader.destroy(public_id=public_id)
            self.image_response = dict()
        super(Design, self).save(**kwargs)


class DesignOrderInstance(CreateUpdate):
    design = ForeignKey(Design, on_delete=PROTECT)
    base_price = PositiveFloatField()
    discount = PercentField(default=0)
    quantity = PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.design} / {self.base_price}"

    @property
    def final_price(self):
        return self.base_price - (self.base_price * self.discount)

    def save(self, **kwargs):
        if not self.base_price:
            self.base_price = self.design.base_price
        if not self.discount:
            self.discount = self.design.discount
        super(DesignOrderInstance, self).save(**kwargs)


class Cart(CreateUpdate):
    user = ForeignKey(User, on_delete=PROTECT)
    design = ForeignKey(Design, on_delete=PROTECT)
    quantity = PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.design} / {self.user}"

    class Meta:
        unique_together = (("user", "design"),)

    def clean(self) -> None:
        if self.design.user == self.user:
            raise ValidationError(
                {"design": "You can't add your own design to cart."}
            )
        if self.quantity > self.design.stock:
            raise ValidationError(
                {"design": f"Not enough stock for design {self.design.title}."}
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
    card_number = CharField(max_length=16, validators=[MinLengthValidator(16)])
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
        super(Address, self).save(**kwargs)


class Order(CreateUpdate):
    user = ForeignKey(User, on_delete=PROTECT)
    design_order_instances = ManyToManyField(DesignOrderInstance)
    discount = PercentField(default=0)
    delivery_fee = PositiveFloatField(default=DISCOUNT_FEE)
    address = ForeignKey(Address, on_delete=PROTECT)
    card = ForeignKey(Card, on_delete=PROTECT)

    def __str__(self):
        return f"{self.delivery_fee} / {self.user}"

    @property
    def base_price(self):
        if self.id and self.design_order_instances.exists():
            return sum(
                x.final_price for x in self.design_order_instances.all()
            )
        return 0

    @property
    def final_price(self):
        return self.base_price - (self.base_price * self.discount)

    @property
    def price_paid(self):
        return self.final_price + self.delivery_fee

    # def clean(self):
    #     for design_order in self.design_order_instances.all():
    #         if self.user == design_order.design.user:
    #             raise ValidationError({"design": "User can't order it's own design."})

    def save(self, **kwargs):
        if self.delivery_fee is None:
            self.delivery_fee = (
                DISCOUNT_FEE
                if self.final_price < DISCOUNT_FEE_APPLICABLE_ON
                else 0
            )
        super(Order, self).save(**kwargs)
