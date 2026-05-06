from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from ..models.queue_orm import QueueORM
from ..domain.queue import QueueItem


class QueueRepository:
    def __init__(self, session: Session):
        self.session = session

    def enqueue(self, facility_id: int, user_id: int, enqueued_at: datetime = None) -> QueueItem:
        from datetime import datetime as _dt
        enq = enqueued_at or _dt.utcnow()
        orm = QueueORM(facility_id=facility_id, user_id=user_id, enqueued_at=enq)
        self.session.add(orm)
        self.session.commit()
        self.session.refresh(orm)
        return self._to_domain(orm)

    def peek_oldest(self, facility_id: int) -> Optional[QueueItem]:
        stmt = select(QueueORM).where(QueueORM.facility_id == facility_id).order_by(QueueORM.enqueued_at)
        orm = self.session.exec(stmt).first()
        return self._to_domain(orm) if orm else None

    def dequeue(self, id: int) -> None:
        orm = self.session.get(QueueORM, id)
        if orm:
            self.session.delete(orm)
            self.session.commit()

    def list_for_facility(self, facility_id: int) -> List[QueueItem]:
        stmt = select(QueueORM).where(QueueORM.facility_id == facility_id).order_by(QueueORM.enqueued_at)
        return [self._to_domain(r) for r in self.session.exec(stmt).all()]

    def _to_domain(self, orm: QueueORM) -> QueueItem:
        if orm is None:
            return None
        return QueueItem(id=orm.id, facility_id=orm.facility_id, user_id=orm.user_id, enqueued_at=orm.enqueued_at)
