from datetime import date
from typing import List, Optional

from sqlmodel import Session, select

from ..models.reservation_orm import ReservationORM
from ..domain.reservation import Reservation, ReservationStatus


class ReservationRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, user_id: str, facility_id: int, start_date: date, end_date: date) -> Reservation:
        orm = ReservationORM(
            user_id=user_id,
            facility_id=facility_id,
            start_date=start_date,
            end_date=end_date,
            status=ReservationStatus.PENDING.value,
        )
        self.session.add(orm)
        self.session.commit()
        self.session.refresh(orm)
        return self._to_domain(orm)

    def get_by_id(self, reservation_id: int) -> Optional[Reservation]:
        orm = self.session.get(ReservationORM, reservation_id)
        return self._to_domain(orm) if orm else None

    def list_by_user(self, user_id: str) -> List[Reservation]:
        stmt = select(ReservationORM).where(ReservationORM.user_id == user_id)
        results = self.session.exec(stmt).all()
        return [self._to_domain(r) for r in results]

    def list_all(self) -> List[Reservation]:
        stmt = select(ReservationORM)
        results = self.session.exec(stmt).all()
        return [self._to_domain(r) for r in results]

    def find_overlapping_approved(self, facility_id: int, start_date: date, end_date: date) -> List[Reservation]:
        stmt = select(ReservationORM).where(
            ReservationORM.facility_id == facility_id,
            ReservationORM.status == ReservationStatus.APPROVED.value,
            ReservationORM.start_date < end_date,
            ReservationORM.end_date > start_date,
        )
        results = self.session.exec(stmt).all()
        return [self._to_domain(r) for r in results]

    def update_status(self, reservation_id: int, status: ReservationStatus) -> Optional[Reservation]:
        orm = self.session.get(ReservationORM, reservation_id)
        if not orm:
            return None
        orm.status = status.value
        self.session.add(orm)
        self.session.commit()
        self.session.refresh(orm)
        return self._to_domain(orm)

    def _to_domain(self, orm: ReservationORM) -> Reservation:
        return Reservation(
            id=orm.id,
            user_id=orm.user_id,
            facility_id=orm.facility_id,
            start_date=orm.start_date,
            end_date=orm.end_date,
            status=ReservationStatus(orm.status),
            created_at=orm.created_at,
        )
