from datetime import date, datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel

class ReservationStatus(str, Enum):
    PENDING = "MENUNGGU"
    APPROVED = "DISETUJUI"
    REJECTED = "DITOLAK"

class Reservation(BaseModel):
    id: int
    user_id: str
    facility_id: int
    facility_name: str
    start_date: datetime
    end_date: datetime
    purpose: str
    status: ReservationStatus
    created_at: datetime
    user_email: Optional[str] = None
    user_role: Optional[str] = None
    rejection_reason: Optional[str] = None
    damage_report: Optional[str] = None

