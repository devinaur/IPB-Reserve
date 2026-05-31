from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from ..models.notification_orm import NotificationORM
from ..models.notification import Notification


class NotificationRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(
        self,
        user_id: str,
        title: str,
        message: str,
        link: Optional[str] = None
    ) -> Notification:
        orm = NotificationORM(
            user_id=user_id,
            title=title,
            message=message,
            link=link,
            is_read=False,
            created_at=datetime.utcnow()
        )
        self.session.add(orm)
        self.session.commit()
        self.session.refresh(orm)
        return self._to_domain(orm)

    def list_by_user(self, user_id: str) -> List[Notification]:
        # If user is admin, they also see "admin" notifications
        # If user is regular user, they only see notifications meant for their user_id
        stmt = select(NotificationORM).where(NotificationORM.user_id == user_id).order_by(NotificationORM.created_at.desc())
        results = self.session.exec(stmt).all()
        return [self._to_domain(r) for r in results]

    def mark_as_read(self, notification_id: int) -> Optional[Notification]:
        orm = self.session.get(NotificationORM, notification_id)
        if not orm:
            return None
        orm.is_read = True
        self.session.add(orm)
        self.session.commit()
        self.session.refresh(orm)
        return self._to_domain(orm)

    def mark_all_as_read(self, user_id: str) -> None:
        stmt = select(NotificationORM).where(NotificationORM.user_id == user_id, NotificationORM.is_read == False)
        results = self.session.exec(stmt).all()
        for orm in results:
            orm.is_read = True
            self.session.add(orm)
        self.session.commit()

    def _to_domain(self, orm: NotificationORM) -> Notification:
        return Notification(
            id=orm.id,
            user_id=orm.user_id,
            title=orm.title,
            message=orm.message,
            link=orm.link,
            is_read=orm.is_read,
            created_at=orm.created_at
        )
