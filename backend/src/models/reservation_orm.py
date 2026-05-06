from datetime import datetime, date
from typing import Optional

from sqlmodel import SQLModel, Field


class ReservationORM(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="userorm.id", nullable=False, index=True)
    facility_id: int = Field(foreign_key="facilityorm.id", nullable=False, index=True)
    start_date: date
    end_date: date
    status: str = Field(default="PENDING")
    created_at: datetime = Field(default_factory=datetime.utcnow)
