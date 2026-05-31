import os
from typing import Dict, Generator

from dotenv import load_dotenv
from sqlmodel import create_engine, Session, SQLModel

load_dotenv()

class DatabaseManager:
    def __init__(self, database_url: str = None):
        url = database_url or os.getenv("DATABASE_URL", "sqlite:///./dev.db")
        # Normalize postgres:// to postgresql:// for SQLAlchemy compatibility
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        self.database_url = url
        self.connect_args: Dict = {}
        if self.database_url.startswith("sqlite"):
            self.connect_args["check_same_thread"] = False
        self.engine = create_engine(self.database_url, echo=False, connect_args=self.connect_args)

    def init_db(self) -> None:
        SQLModel.metadata.create_all(self.engine)

    def get_session(self) -> Generator[Session, None, None]:
        with Session(self.engine) as s:
            yield s

db_manager = DatabaseManager()

# Proxies for backward compatibility and ease of use in FastAPI Depends
def init_db() -> None:
    db_manager.init_db()

def get_session():
    yield from db_manager.get_session()

# Keep engine for backward compatibility if needed
engine = db_manager.engine
