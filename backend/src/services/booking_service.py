from typing import List
from datetime import datetime
from ..repositories.booking_repo import BookingRepository
from ..domain.booking import Booking


class BookingService:
    def __init__(self, repo: BookingRepository):
        self.repo = repo

    def create_booking(self, facility_id: int, user_id: int, starts_at: datetime, ends_at: datetime) -> Booking:
        # check basic validity
        if ends_at <= starts_at:
            raise ValueError("Invalid time window")

        # fetch overlapping bookings
        overlaps = self.repo.list_for_facility(facility_id, starts_at, ends_at)
        if overlaps:
            raise ValueError("Time slot conflict with existing booking")

        return self.repo.create(facility_id, user_id, starts_at, ends_at, status="confirmed")

    def list_for_facility(self, facility_id: int) -> List[Booking]:
        return self.repo.list_for_facility(facility_id)

    def list_by_user(self, user_id: int) -> List[Booking]:
        return self.repo.list_by_user(user_id)
