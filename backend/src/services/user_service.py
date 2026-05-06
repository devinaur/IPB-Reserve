from typing import List

from ..domain.user import User, UserRole
from ..repositories.user_repo import UserRepository


class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    def get_or_create_user(self, uid: str, email: str) -> User:
        user = self.repo.get_by_uid(uid)
        if user:
            return user
        return self.repo.create(uid=uid, email=email, role=UserRole.USER)

    def seed_initial_admins(self, admin_emails: List[str]) -> None:
        for email in admin_emails:
            existing = self.repo.get_by_email(email)
            if existing and existing.role != UserRole.ADMIN:
                self.repo.update_role(existing.id, UserRole.ADMIN)

    def promote_to_admin(self, uid: str) -> User:
        user = self.repo.get_by_uid(uid)
        if not user:
            raise ValueError("User not found")
        return self.repo.update_role(uid, UserRole.ADMIN)

    def ensure_user_exists(self, uid: str, email: str) -> User:
        return self.get_or_create_user(uid=uid, email=email)
