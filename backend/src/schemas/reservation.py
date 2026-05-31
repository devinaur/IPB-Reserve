from datetime import date, datetime
from pydantic import BaseModel, Field
from typing import Optional


class ReservationCreate(BaseModel):
    facility_id: int
    start_date: datetime
    end_date: datetime
    purpose: str


class ReservationStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(APPROVED|REJECTED|DISETUJUI|DITOLAK)$")
    rejection_reason: Optional[str] = None


class ReservationOut(BaseModel):
    id: int
    user_id: str
    facility_id: int
    facility_name: str
    start_date: datetime
    end_date: datetime
    purpose: str
    status: str
    created_at: datetime
    user_email: Optional[str] = None
    user_role: Optional[str] = None
    rejection_reason: Optional[str] = None
    damage_report: Optional[str] = None


class ReservationDamageReport(BaseModel):
    damage_report: str

