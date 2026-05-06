from dataclasses import dataclass
from typing import Optional


@dataclass
class Facility:
    id: int
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
