# # Standard Library
import secrets


def random_pin() -> int:
    return secrets.SystemRandom().randint(100000, 999999)


def default_image_response() -> dict:
    return {
        "asset_id": "db83cec867d99efeb1b1026cb4845304",
        "public_id": "Orderrr-v2/Users/faeynvilono6ws5vvjar",
        "format": "svg",
        "version": 1726994266,
        "resource_type": "image",
        "type": "upload",
        "created_at": "2024-09-22T08:37:46Z",
        "bytes": 2042,
        "width": 1080,
        "height": 1080,
        "folder": "Orderrr-v2/Users",
        "access_mode": "public",
        "url": "http://res.cloudinary.com/shivam2001/image/upload/v1726994266/Orderrr-v2/Users/faeynvilono6ws5vvjar.svg",
        "secure_url": "https://res.cloudinary.com/shivam2001/image/upload/v1726994266/Orderrr-v2/Users/faeynvilono6ws5vvjar.svg",
        "next_cursor": "1cb41facf5eb91592ba02df2d7757235905c234aa86a7be1a1eb39c03eb473ab",
        "derived": [],
    }


def get_thumbnail_url(url: str):
    parts = url.split("/")
    parts.insert(parts.index("upload") + 1, "c_fill,h_400,w_400,g_face")
    return "/".join(parts)
