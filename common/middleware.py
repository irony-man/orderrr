import pytz
from django.utils import timezone
from django.utils.deprecation import MiddlewareMixin
from django.utils.timezone import activate

EXCLUDED_ROUTES = (
    "/login/",
    "/logout/",
)


class PatchRequestMiddleware:
    """Adds a request.profile and request.tenant mapping to
    request.user.userprofile to all authenticated requests."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        u = request.user
        if not request.path.startswith(EXCLUDED_ROUTES):
            if u.is_authenticated and hasattr(u, "userprofile"):
                request.profile = u.userprofile
        return self.get_response(request)


class TimezoneMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(self.process_request(request))
        return response

    def process_request(self, request):
        if not request.path.startswith("/odr-adm"):
            return request
        if request.user.is_authenticated:
            activate(pytz.timezone("Asia/Kolkata"))
        else:
            timezone.deactivate()
        return request
