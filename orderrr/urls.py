from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

from common.urls import router
from common.views import HomePage, LoginAPIView, Logout

urlpatterns = [
    path("odr-adm/", admin.site.urls),
    re_path(r"api/v2/", include(router.urls)),
    path("api/v2/login/", LoginAPIView.as_view(), name="login"),
    path("logout/", Logout.as_view(), name="logout"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns.append(
    re_path(r"^", HomePage.as_view(), name="home"),
)
