from copy import copy

from django.contrib.auth.models import User
from django.db.models import QuerySet
from django_countries.serializers import CountryFieldMixin
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from common.models import (
    Address,
    Card,
    Cart,
    Design,
    Order,
    UserProfile,
    WishList,
)
from common.taxonomies import DesignType, serialize


class SerializedRelationField(serializers.Field):
    def __init__(
        self, lookup_key: str, queryset: QuerySet, repr_serializer, **kwargs
    ):
        self.lookup_key = lookup_key
        self.queryset = queryset
        self.repr_serializer = repr_serializer
        super(SerializedRelationField, self).__init__(**kwargs)

    def to_internal_value(self, data):
        try:
            value = data
            if isinstance(data, dict):
                key = self.lookup_key.split("__")[-1]
                value = data[key]
            if value:
                return self.queryset.get(**{self.lookup_key: value})
        except Exception as exc:
            raise ValidationError(exc)
        else:
            return None

    def to_representation(self, value):
        return self.repr_serializer(instance=value, context=self.context).data


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "email",
        ]


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    email = serializers.CharField(source="user.email")
    is_staff = serializers.BooleanField(source="user.is_staff", read_only=True)
    raw_password = serializers.CharField(write_only=True, required=False)
    choices = serializers.SerializerMethodField()
    cart_length = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            "full_name",
            "username",
            "email",
            "display_picture",
            "email_otp",
            "email_otp_sent",
            "email_verified",
            "uid",
            "created",
            "updated",
            "cart_length",
            "choices",
            "is_staff",
            "raw_password",
        ]

    def get_cart_length(self, instance):
        return instance.user.cart_set.count()

    def get_choices(self, instance):
        from django_countries import countries

        serialized_countries = []
        for country in countries:
            serialized_countries.append(
                {"value": country.code.upper(), "name": country.name}
            )
        choices = {
            "country": serialized_countries,
            "design_type": serialize(DesignType),
        }
        return choices

    def validate(self, attrs):
        if "request" in self.context:
            user_instance = self.context["request"].user
            user = User(**attrs.get("user"))
            if user_instance.username != user.username:
                user.validate_unique()
        return super(UserProfileSerializer, self).validate(attrs)

    def create(self, validated_data):
        user = User(**validated_data.pop("user"))
        user.set_password(raw_password=validated_data.pop("raw_password"))
        instance = UserProfile(**validated_data)
        instance.user = user
        user.save()
        instance.save()
        return instance

    def update(self, instance, validated_data):
        if "request" in self.context:
            user_instance = self.context["request"].user
            user = User(**validated_data.pop("user"))
            instance.user.username = user.username
            instance.user.email = user.email
            instance.user.save()
            if "raw_password" in validated_data:
                user_instance.set_password(
                    raw_password=validated_data.pop("raw_password")
                )
                user_instance.save()

        return super(UserProfileSerializer, self).update(
            instance, validated_data
        )


class LiteUserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "display_picture",
            "username",
            "email",
            "uid",
        ]


class DesignSerializer(serializers.ModelSerializer):
    user = LiteUserProfileSerializer(source="user.userprofile", read_only=True)
    is_yours = serializers.SerializerMethodField()
    cart_uid = serializers.SerializerMethodField()
    wishlist_uid = serializers.SerializerMethodField()

    class Meta:
        model = Design
        fields = [
            "user",
            "title",
            "image",
            "base_price",
            "final_price",
            "discount",
            "stock",
            "design_type",
            "description",
            "uid",
            "is_yours",
            "cart_uid",
            "wishlist_uid",
            "created",
            "updated",
        ]

    def get_is_yours(self, instance: Design):
        if "request" in self.context:
            user = self.context["request"].user
            if user.is_authenticated:
                return user == instance.user
        return False

    def get_cart_uid(self, instance: Design):
        if "request" in self.context:
            user = self.context["request"].user
            if user.is_authenticated:
                if cart := instance.cart_set.filter(user=user).first():
                    return cart.uid
        return None

    def get_wishlist_uid(self, instance: Design):
        if "request" in self.context:
            user = self.context["request"].user
            if user.is_authenticated:
                if wishlist := instance.wishlist_set.filter(user=user).first():
                    return wishlist.uid
        return None


class OrderSerializer(serializers.ModelSerializer):
    designs = DesignSerializer(many=True, read_only=True)
    designs_id = serializers.PrimaryKeyRelatedField(
        queryset=Design.objects.all(),
        write_only=True,
        many=True,
    )

    class Meta:
        model = Order
        fields = [
            "user",
            "designs",
            "designs_id",
            "price_paid",
            "discount",
            "uid",
            "created",
            "updated",
        ]

    def create(self, validated_data):
        designs = validated_data.pop("designs_id", [])
        instance = Order.objects.create(**validated_data)
        instance.designs.add(*designs)

        return instance

    def update(self, instance, validated_data):
        designs = validated_data.pop("designs_id", [])
        instance.documents.set(designs)

        return super(OrderSerializer, self).update(instance, validated_data)


class CartSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    design = SerializedRelationField("uid", Design.objects, DesignSerializer)

    class Meta:
        model = Cart
        fields = ["user", "design", "uid", "created", "updated"]


class WishListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    design = SerializedRelationField("uid", Design.objects, DesignSerializer)

    class Meta:
        model = WishList
        fields = ["user", "design", "uid", "created", "updated"]


class CardSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Card
        fields = [
            "user",
            "name",
            "card_number",
            "name_on_card",
            "card_expiry",
            "uid",
            "created",
            "updated",
        ]


class AddressSerializer(CountryFieldMixin, serializers.ModelSerializer):
    country_display = serializers.ReadOnlyField()
    user = UserSerializer(read_only=True)

    class Meta:
        model = Address
        fields = [
            "user",
            "address_line",
            "postal_code",
            "city",
            "state",
            "country",
            "country_display",
            "uid",
            "created",
            "updated",
        ]

    def validate(self, attrs):
        instance = Address(**attrs)
        instance.clean()
        return super(AddressSerializer, self).validate(attrs)
