from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class NotificationORM(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: str  # UID of target user, or "admin" for administrator notifications
    title: str
    message: str
    link: Optional[str] = None
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
