from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class BookingORM(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    facility_id: int
    user_id: int
    starts_at: datetime
    ends_at: datetime
    status: str = "confirmed"
