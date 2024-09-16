from rest_framework.routers import DefaultRouter

from common import views

router = DefaultRouter()

router.register("user", views.UserViewSet, basename="user")
router.register(
    "user-profile", views.UserProfileViewSet, basename="user-profile"
)
router.register("design", views.DesignViewSet, basename="design")
router.register("order", views.OrderViewSet, basename="order")
router.register("cart", views.CartViewSet, basename="cart")
router.register("wishlist", views.WishListViewSet, basename="wishlist")
router.register("card", views.CardViewSet, basename="card")
router.register("address", views.AddressViewSet, basename="address")
