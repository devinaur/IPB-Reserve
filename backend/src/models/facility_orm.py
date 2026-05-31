from sqlmodel import SQLModel, Field
from typing import Optional


class FacilityORM(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    campus: Optional[str] = Field(default="Dramaga")
    category: Optional[str] = Field(default="Auditorium")
    capacity: Optional[int] = None
    status: str = Field(default="AVAILABLE")
    image: Optional[str] = None
    tags: Optional[str] = None  # Store as comma-separated string for simplicity
