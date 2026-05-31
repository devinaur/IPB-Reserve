from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class Notification(BaseModel):
    id: int
    user_id: str
    title: str
    message: str
    link: Optional[str] = None
    is_read: bool
    created_at: datetime
