from typing import Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class QueueItem:
    id: Optional[int]
    facility_id: int
    user_id: int
    enqueued_at: datetime
