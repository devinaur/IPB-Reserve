from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, date

class ReservationORM(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: str
    facility_id: int
    facility_name: str
    start_date: datetime
    end_date: datetime
    purpose: str = Field(default="")
    status: str = Field(default="MENUNGGU")  # MENUNGGU, DISETUJUI, DITOLAK
    created_at: datetime = Field(default_factory=datetime.utcnow)
    document_url: Optional[str] = None
    rejection_reason: Optional[str] = None
    damage_report: Optional[str] = None
