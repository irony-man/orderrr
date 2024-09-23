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


class DesignOrderingType(TextChoices):
    BASE_PRICE_LOW_TO_HIGH = "base_price", _("Base Price - Low to High")
    BASE_PRICE_HIGH_TO_LOW = "-base_price", _("Base Price - High to Low")
    DISCOUNT_LOW_TO_HIGH = "discount", _("Discount - Low to High")
    DISCOUNT_HIGH_TO_LOW = "-discount", _("Discount - High to Low")
