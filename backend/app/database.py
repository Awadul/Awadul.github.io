from sqlalchemy import event
from sqlmodel import SQLModel, create_engine

from .config import Settings


def create_database_engine(settings: Settings):
    path = settings.database_path
    if not path.is_absolute():
        from .config import BACKEND_DIR

        path = BACKEND_DIR / path
    path.parent.mkdir(parents=True, exist_ok=True)
    engine = create_engine(
        f"sqlite:///{path.as_posix()}",
        connect_args={"check_same_thread": False, "timeout": 15},
    )

    @event.listens_for(engine, "connect")
    def configure_sqlite(connection, _record):
        cursor = connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA busy_timeout=15000")
        cursor.close()

    return engine


def initialize_database(engine):
    SQLModel.metadata.create_all(engine)

