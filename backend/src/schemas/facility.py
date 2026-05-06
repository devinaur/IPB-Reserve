from pydantic import BaseModel
from typing import Optional


class FacilityCreate(BaseModel):
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None


class FacilityUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None


class FacilityOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
