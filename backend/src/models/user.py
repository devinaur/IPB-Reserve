from pydantic import BaseModel
from enum import Enum

class UserRole(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"

class User(BaseModel):
    id: str
    email: str
    role: UserRole

    def is_admin(self) -> bool:
        return self.role == UserRole.ADMIN
