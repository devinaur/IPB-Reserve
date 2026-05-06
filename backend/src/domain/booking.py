from typing import Optional
from datetime import datetime


class Booking:
    """Domain booking entity with simple conflict detection."""

    def __init__(self, id: Optional[int], facility_id: int, user_id: int, starts_at: datetime, ends_at: datetime, status: str = "confirmed"):
        self.id = id
        self.facility_id = facility_id
        self.user_id = user_id
        self.starts_at = starts_at
        self.ends_at = ends_at
        self.status = status

    def conflicts_with(self, other: "Booking") -> bool:
        if self.facility_id != other.facility_id:
            return False
        return not (self.ends_at <= other.starts_at or self.starts_at >= other.ends_at)
