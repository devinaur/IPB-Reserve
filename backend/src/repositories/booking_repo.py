from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from ..models.booking_orm import BookingORM
from ..domain.booking import Booking


class BookingRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, facility_id: int, user_id: int, starts_at: datetime, ends_at: datetime, status: str = "confirmed") -> Booking:
        orm = BookingORM(facility_id=facility_id, user_id=user_id, starts_at=starts_at, ends_at=ends_at, status=status)
        self.session.add(orm)
        self.session.commit()
        self.session.refresh(orm)
        return self._to_domain(orm)

    def list_for_facility(self, facility_id: int, window_start: datetime = None, window_end: datetime = None) -> List[Booking]:
        stmt = select(BookingORM).where(BookingORM.facility_id == facility_id)
        results = self.session.exec(stmt).all()
        bookings = [self._to_domain(r) for r in results]
        if window_start and window_end:
            # normalize to UTC naive for comparison (strip timezone)
            ws = window_start.replace(tzinfo=None) if window_start.tzinfo else window_start
            we = window_end.replace(tzinfo=None) if window_end.tzinfo else window_end
            bookings = [b for b in bookings if not (b.ends_at <= ws or b.starts_at >= we)]
        return bookings

    def list_by_user(self, user_id: int) -> List[Booking]:
        stmt = select(BookingORM).where(BookingORM.user_id == user_id)
        return [self._to_domain(r) for r in self.session.exec(stmt).all()]

    def _to_domain(self, orm: BookingORM) -> Booking:
        return Booking(id=orm.id, facility_id=orm.facility_id, user_id=orm.user_id, starts_at=orm.starts_at, ends_at=orm.ends_at, status=orm.status)
