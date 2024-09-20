# from collections import defaultdict

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models import Case, F, Q, Sum, Value, When

# from django.http import Http404, HttpResponse
# from django.shortcuts import get_object_or_404
# from django.utils import timezone
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from loguru import logger
from rest_framework.decorators import action

# from rest_framework.exceptions import ValidationError
# from rest_framework.filters import OrderingFilter, SearchFilter
# from rest_framework.mixins import ListModelMixin
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from common.filters import DesignFilter
from common.models import (
    Address,
    Card,
    Cart,
    Design,
    Order,
    UserProfile,
    WishList,
)
from common.serializers import (
    AddressSerializer,
    CardSerializer,
    CartSerializer,
    DesignSerializer,
    LiteUserProfileSerializer,
    LoginSerializer,
    OrderSerializer,
    UserProfileSerializer,
    UserSerializer,
    WishListSerializer,
)


class AuthMixin:
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(AuthMixin, self).dispatch(  # noqa
            request, *args, **kwargs
        )


class HomePage(TemplateView):
    template_name = "common/home.html"


class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]

            user = authenticate(request, username=username, password=password)
            if not user:
                return Response(
                    {"message": "Invalid login credentials!!"},
                    status=HTTP_400_BAD_REQUEST,
                )
            login(request, user)
            return Response(
                UserProfileSerializer(instance=user.userprofile).data,
                status=HTTP_200_OK,
            )

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class Logout(AuthMixin, APIView):
    def get(self, request, *args, **kwargs):
        try:
            logout(request)
            return Response({"message": "Successfully logged out!!"})
        except Exception as e:
            logger.error(e)
            return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfileViewSet(AuthMixin, ModelViewSet):
    lookup_field = "uid"
    serializer_class = LiteUserProfileSerializer
    http_method_names = ("get", "patch")

    def get_queryset(self):
        return UserProfile.objects.all()


class UserViewSet(ModelViewSet):
    serializer_class = UserProfileSerializer
    http_method_names = ("get", "post", "patch")

    def get_queryset(self):
        if self.request.method.upper() == "PATCH" and self.kwargs.get("uid"):
            return UserProfile.objects.filter(user=self.request.user)
        return UserProfile.objects.all()

    def get_object(self):
        if self.request.user.is_authenticated:
            return UserProfile.objects.get(user=self.request.user)


class DesignViewSet(ModelViewSet):
    serializer_class = DesignSerializer
    lookup_field = "uid"
    filterset_class = DesignFilter

    def get_queryset(self):
        return Design.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderViewSet(AuthMixin, ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = "uid"

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CartViewSet(AuthMixin, ModelViewSet):
    serializer_class = CartSerializer
    lookup_field = "uid"

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(methods=["GET"], detail=False)
    def summary(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serialized_data = self.get_serializer(instance=queryset, many=True)
        item_total = sum([x.design.final_price for x in queryset])
        delivery_charge = 40 if item_total < 500 else 0
        return Response(
            dict(
                items=serialized_data.data,
                summary=dict(
                    total_items=queryset.count(),
                    item_total=item_total,
                    delivery_charge=delivery_charge,
                    total_price=item_total + delivery_charge,
                ),
            )
        )


class WishListViewSet(AuthMixin, ModelViewSet):
    serializer_class = WishListSerializer
    lookup_field = "uid"

    def get_queryset(self):
        return WishList.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CardViewSet(AuthMixin, ModelViewSet):
    serializer_class = CardSerializer
    lookup_field = "uid"

    def get_queryset(self):
        return Card.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddressViewSet(AuthMixin, ModelViewSet):
    serializer_class = AddressSerializer
    lookup_field = "uid"

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
