from dataclasses import dataclass
from datetime import date, datetime
from enum import Enum


class ReservationStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


@dataclass
class Reservation:
    id: int
    user_id: str
    facility_id: int
    start_date: date
    end_date: date
    status: ReservationStatus
    created_at: datetime

    def overlaps(self, other: "Reservation") -> bool:
        return self.start_date < other.end_date and self.end_date > other.start_date

    def is_in_past(self) -> bool:
        return self.start_date < datetime.utcnow().date()
