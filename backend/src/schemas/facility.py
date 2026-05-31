from pydantic import BaseModel
from typing import Optional


class FacilityCreate(BaseModel):
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    campus: Optional[str] = "Dramaga"
    category: Optional[str] = "Auditorium"
    capacity: Optional[int] = None
    status: Optional[str] = "AVAILABLE"
    image: Optional[str] = None
    tags: Optional[str] = None


class FacilityUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    campus: Optional[str] = None
    category: Optional[str] = None
    capacity: Optional[int] = None
    status: Optional[str] = None
    image: Optional[str] = None
    tags: Optional[str] = None


class FacilityOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    campus: Optional[str] = None
    category: Optional[str] = None
    capacity: Optional[int] = None
    status: str
    image: Optional[str] = None
    tags: Optional[str] = None
