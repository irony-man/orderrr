from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

# from common.urls import router

urlpatterns = [
    path("ord-adm/", admin.site.urls),
    # re_path(r"api/v1/", include(router.urls)),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
