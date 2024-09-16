from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

from common.urls import router
from common.views import HomePage

urlpatterns = [
    path("odr-adm/", admin.site.urls),
    re_path(r"api/v2/", include(router.urls)),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns.append(
    re_path(r"^", HomePage.as_view(), name="home"),
)
