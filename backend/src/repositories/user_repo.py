from typing import Optional

from sqlmodel import Session, select

from ..models.user_orm import UserORM
from ..domain.user import User, UserRole


class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_uid(self, uid: str) -> Optional[User]:
        orm = self.session.get(UserORM, uid)
        return self._to_domain(orm) if orm else None

    def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(UserORM).where(UserORM.email == email)
        orm = self.session.exec(stmt).one_or_none()
        return self._to_domain(orm) if orm else None

    def create(self, uid: str, email: str, role: UserRole = UserRole.USER) -> User:
        orm = UserORM(id=uid, email=email, role=role.value)
        self.session.add(orm)
        self.session.commit()
        self.session.refresh(orm)
        return self._to_domain(orm)

    def update_role(self, uid: str, role: UserRole) -> Optional[User]:
        orm = self.session.get(UserORM, uid)
        if not orm:
            return None
        orm.role = role.value
        self.session.add(orm)
        self.session.commit()
        self.session.refresh(orm)
        return self._to_domain(orm)

    def _to_domain(self, orm: UserORM) -> User:
        return User(id=orm.id, email=orm.email, role=UserRole(orm.role))
