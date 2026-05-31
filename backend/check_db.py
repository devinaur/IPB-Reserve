from sqlmodel import Session, select
from src.database.db import engine
from src.models.reservation_orm import ReservationORM
from src.models.user_orm import UserORM
from src.models.facility_orm import FacilityORM

class DBChecker:
    def __init__(self, engine):
        self.engine = engine

    def check_db(self):
        with Session(self.engine) as session:
            facilities = session.exec(select(FacilityORM)).all()
            print(f"Facilities found: {len(facilities)}")
            for f in facilities:
                print(f" - ID: {f.id}, Name: {f.name}, Status: {f.status}")

            users = session.exec(select(UserORM)).all()
            print(f"Users found: {len(users)}")
            for u in users:
                print(f" - {u.email} (ID: {u.id})")
                
            reservations = session.exec(select(ReservationORM)).all()
            print(f"Reservations found: {len(reservations)}")
            for r in reservations:
                print(f" - ID: {r.id}, UserID: {r.user_id}, Facility: {r.facility_name}, Status: {r.status}")

if __name__ == "__main__":
    checker = DBChecker(engine)
    checker.check_db()
