from datetime import date, datetime
from typing import List, Optional

from sqlmodel import Session, select

from ..models.reservation_orm import ReservationORM
from ..models.reservation import Reservation, ReservationStatus


class ReservationRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, user_id: str, facility_id: int, facility_name: str, start_date: datetime, end_date: datetime, purpose: str) -> Reservation:
        orm = ReservationORM(
            user_id=user_id,
            facility_id=facility_id,
            facility_name=facility_name,
            start_date=start_date,
            end_date=end_date,
            purpose=purpose,
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
        from ..models.user_orm import UserORM
        stmt = select(ReservationORM, UserORM).outerjoin(UserORM, ReservationORM.user_id == UserORM.id).where(ReservationORM.user_id == user_id)
        results = self.session.exec(stmt).all()
        
        reservations = []
        for r_orm, u_orm in results:
            domain = self._to_domain(r_orm)
            if u_orm:
                domain.user_email = u_orm.email
                domain.user_role = u_orm.role
            reservations.append(domain)
        return reservations

    def list_all(self) -> List[Reservation]:
        from ..models.user_orm import UserORM
        stmt = select(ReservationORM, UserORM).outerjoin(UserORM, ReservationORM.user_id == UserORM.id)
        results = self.session.exec(stmt).all()
        
        reservations = []
        for r_orm, u_orm in results:
            domain = self._to_domain(r_orm)
            if u_orm:
                domain.user_email = u_orm.email
                domain.user_role = u_orm.role
            reservations.append(domain)
        return reservations

    def find_overlapping_approved(self, facility_id: int, start_date: datetime, end_date: datetime) -> List[Reservation]:
        stmt = select(ReservationORM).where(
            ReservationORM.facility_id == facility_id,
            ReservationORM.status == ReservationStatus.APPROVED.value,
            ReservationORM.start_date < end_date,
            ReservationORM.end_date > start_date,
        )
        results = self.session.exec(stmt).all()
        return [self._to_domain(r) for r in results]

    def update_status(self, reservation_id: int, status: ReservationStatus, rejection_reason: Optional[str] = None) -> Optional[Reservation]:
        orm = self.session.get(ReservationORM, reservation_id)
        if not orm:
            return None
        orm.status = status.value
        if rejection_reason is not None:
            orm.rejection_reason = rejection_reason
        self.session.add(orm)
        self.session.commit()
        self.session.refresh(orm)
        return self._to_domain(orm)

    def update_damage_report(self, reservation_id: int, damage_report: str) -> Optional[Reservation]:
        orm = self.session.get(ReservationORM, reservation_id)
        if not orm:
            return None
        orm.damage_report = damage_report
        self.session.add(orm)
        self.session.commit()
        self.session.refresh(orm)
        return self._to_domain(orm)

    def delete(self, reservation_id: int) -> bool:
        orm = self.session.get(ReservationORM, reservation_id)
        if not orm:
            return False
        self.session.delete(orm)
        self.session.commit()
        return True

    def _to_domain(self, orm: ReservationORM) -> Reservation:
        return Reservation(
            id=orm.id,
            user_id=orm.user_id,
            facility_id=orm.facility_id,
            facility_name=orm.facility_name,
            start_date=orm.start_date,
            end_date=orm.end_date,
            purpose=orm.purpose,
            status=ReservationStatus(orm.status),
            created_at=orm.created_at,
            rejection_reason=orm.rejection_reason,
            damage_report=orm.damage_report,
        )
