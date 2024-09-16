from typing import Any, Dict, List

from django.db.models import TextChoices
from django.utils.translation import gettext as _


def serialize(klass) -> List[Dict[str, Any]]:
    return [
        {"name": x[1], "value": x[0]} for x in getattr(klass, "choices", [])
    ]


class DesignType(TextChoices):
    PAINTING = "PAINTING", _("Painting")
    POSTER = "POSTER", _("Poster")
    SKETCH = "SKETCH", _("Sketch")
    PHOTOSHOP = "PHOTOSHOP", _("Photoshop")
    ILLUSTRATION = "ILLUSTRATION", _("Illustration")
    NFT = "NFT", _("NFT")
    OTHER = "OTHER", _("Other")
