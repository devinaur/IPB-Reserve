from sqlmodel import SQLModel, Field
from typing import Optional


class FacilityORM(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
