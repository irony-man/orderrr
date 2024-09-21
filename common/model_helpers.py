# # Standard Library
import secrets


def random_pin() -> int:
    return secrets.SystemRandom().randint(100000, 999999)
