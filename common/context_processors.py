from django.conf import settings


def environment_context(request):
    return {"is_live": settings.ENVIRONMENT_NAME == "Production"}
