from sqlmodel import SQLModel, Field


class UserORM(SQLModel, table=True):
    id: str = Field(primary_key=True)
    email: str = Field(index=True, nullable=False, unique=True)
    role: str = Field(default="USER")
