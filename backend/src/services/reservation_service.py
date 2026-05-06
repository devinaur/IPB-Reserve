from datetime import date, datetime
from typing import List

from ..domain.reservation import Reservation, ReservationStatus
from ..domain.user import User
from ..repositories.facility_repo import FacilityRepository
from ..repositories.reservation_repo import ReservationRepository


class ReservationService:
    def __init__(self, reservation_repo: ReservationRepository, facility_repo: FacilityRepository):
        self.reservation_repo = reservation_repo
        self.facility_repo = facility_repo

    def create_reservation(
        self,
        user: User,
        facility_id: int,
        start_date: date,
        end_date: date,
    ) -> Reservation:
        if start_date >= end_date:
            raise ValueError("Reservation end date must be after start date.")

        today = datetime.utcnow().date()
        if start_date < today:
            raise ValueError("Reservations cannot start in the past.")

        facility = self.facility_repo.get_by_id(facility_id)
        if not facility:
            raise ValueError("Facility not found.")

        overlaps = self.reservation_repo.find_overlapping_approved(facility_id, start_date, end_date)
        if overlaps:
            raise ValueError("Reservation overlaps with an existing approved reservation.")

        return self.reservation_repo.create(user_id=user.id, facility_id=facility_id, start_date=start_date, end_date=end_date)

    def list_user_reservations(self, user: User) -> List[Reservation]:
        return self.reservation_repo.list_by_user(user.id)

    def list_all_reservations(self, current_user: User) -> List[Reservation]:
        self._ensure_admin(current_user)
        return self.reservation_repo.list_all()

    def update_reservation_status(self, current_user: User, reservation_id: int, status: ReservationStatus) -> Reservation:
        self._ensure_admin(current_user)
        reservation = self.reservation_repo.get_by_id(reservation_id)
        if not reservation:
            raise ValueError("Reservation not found.")
        return self.reservation_repo.update_status(reservation_id, status)

    def _ensure_admin(self, current_user: User) -> None:
        if not current_user.is_admin():
            raise PermissionError("Admin privileges required.")
