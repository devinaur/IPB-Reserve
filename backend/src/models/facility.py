from typing import Optional
from pydantic import BaseModel

class Facility(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    campus: Optional[str] = "Dramaga"
    category: Optional[str] = "Auditorium"
    capacity: Optional[int] = None
    status: str = "AVAILABLE"
    image: Optional[str] = None
    tags: Optional[str] = None
