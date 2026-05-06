from pydantic import BaseModel
from datetime import datetime


class QueueCreate(BaseModel):
    facility_id: int
    user_id: int


class QueueOut(BaseModel):
    id: int
    facility_id: int
    user_id: int
    enqueued_at: datetime
