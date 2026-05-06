from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class BookingCreate(BaseModel):
    facility_id: int
    user_id: int
    starts_at: datetime
    ends_at: datetime


class BookingOut(BaseModel):
    id: int
    facility_id: int
    user_id: int
    starts_at: datetime
    ends_at: datetime
    status: str
