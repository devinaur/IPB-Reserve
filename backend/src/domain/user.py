from dataclasses import dataclass
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"


@dataclass
class User:
    id: str
    email: str
    role: UserRole

    def is_admin(self) -> bool:
        return self.role == UserRole.ADMIN
