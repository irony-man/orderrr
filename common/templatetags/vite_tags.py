# Standard Library
import json

from django import template
from django.conf import settings
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag
def vite_css(js_path):
    tags = []
    with open(settings.DJANGO_VITE_MANIFEST_PATH, "r") as manifest:
        data = json.loads(manifest.read())
        if obj := data.get(js_path):
            if arr := obj.get("css"):
                for item in arr:
                    tags.append(
                        f'<link rel="stylesheet" '
                        f'href="/static/common/{item}">'
                    )
    return mark_safe(" ".join(tags))  # nosec


@register.simple_tag
def vite_js(js_path):
    tags = []
    with open(settings.DJANGO_VITE_MANIFEST_PATH, "r") as manifest:
        data = json.loads(manifest.read())
        if obj := data.get(js_path):
            if rel_path := obj.get("file"):
                tags.append(
                    f'<script src="/static/common/{rel_path}" type="module">'
                    f"</script>"
                )
    return mark_safe(" ".join(tags))  # nosec


@register.simple_tag
def vite_css_standalone(js_path):
    tags = []
    with open(settings.DJANGO_VITE_MANIFEST_PATH, "r") as manifest:
        data = json.loads(manifest.read())
        if obj := data.get(js_path):
            if rel_path := obj.get("file"):
                tags.append(
                    f'<link rel="stylesheet" '
                    f'href="/static/common/{rel_path}">'
                )
    return mark_safe(" ".join(tags))  # nosec


@register.filter
def format_amount(value: float, symbol: str = "₹") -> str:
    return f"{symbol} {format_number(value)}"


@register.filter
def format_number(value: float) -> str:
    if value:
        return "{:,}".format(value, ".2f")
    return "-"
