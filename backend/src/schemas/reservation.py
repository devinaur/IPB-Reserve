from datetime import date, datetime
from pydantic import BaseModel, Field


class ReservationCreate(BaseModel):
    facility_id: int
    start_date: date
    end_date: date


class ReservationStatusUpdate(BaseModel):
    status: str = Field(..., regex="^(APPROVED|REJECTED)$")


class ReservationOut(BaseModel):
    id: int
    user_id: str
    facility_id: int
    start_date: date
    end_date: date
    status: str
    created_at: datetime
