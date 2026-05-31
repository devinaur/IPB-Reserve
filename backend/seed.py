# pyrefly: ignore [missing-import]
from sqlmodel import Session, select, SQLModel
from datetime import datetime, timedelta
from src.database.db import engine, init_db
from src.models.facility_orm import FacilityORM
from src.models.user_orm import UserORM
from src.models.reservation_orm import ReservationORM
from src.models.notification_orm import NotificationORM

class Seeder:
    def __init__(self, engine):
        self.engine = engine

    def seed_all(self):
        print("Dropping all existing tables...")
        SQLModel.metadata.drop_all(self.engine)
        print("Recreating tables with new schemas...")
        init_db()
        
        with Session(self.engine) as session:
            # 1. Seed Facilities
            facilities_data = [
                {
                    "name": "Lab Komputer Dasar",
                    "description": "Ruang laboratorium komputer yang modern dan nyaman, dilengkapi dengan unit PC terbaru dan koneksi internet stabil untuk kegiatan praktikum, pelatihan, maupun ujian mandiri.",
                    "location": "Gedung A, Lantai 2",
                    "campus": "Dramaga",
                    "category": "Lab Komputer",
                    "capacity": 40,
                    "status": "AVAILABLE",
                    "tags": "DRAMAGA,LAB",
                    "image": "/images/labkom.png"
                },
                {
                    "name": "Auditorium Andi Hakim Nasoetion",
                    "description": "Fasilitas pertemuan ikonik di jantung Kampus IPB Dramaga yang memadukan prestise akademik dengan fungsionalitas modern untuk mendukung berbagai agenda berskala nasional maupun internasional.",
                    "location": "Gedung Rektorat, Sayap Barat",
                    "campus": "Dramaga",
                    "category": "Auditorium",
                    "capacity": 500,
                    "status": "BOOKED",
                    "tags": "DRAMAGA,AUDITORIUM",
                    "image": "/images/ahn.png"
                },
                {
                    "name": "Auditorium FEM",
                    "description": "Auditorium modern di lingkungan Fakultas Ekonomi dan Manajemen, sangat cocok untuk kegiatan akademik, seminar, and pertemuan organisasi mahasiswa.",
                    "location": "Fakultas Ekonomi dan Manajemen",
                    "campus": "Dramaga",
                    "category": "Auditorium",
                    "capacity": 150,
                    "status": "AVAILABLE",
                    "tags": "DRAMAGA,AUDITORIUM",
                    "image": "/images/audit fem.png"
                },
                {
                    "name": "Auditorium Toyib Hadiwijaya",
                    "description": "Salah satu auditorium tertua and bersejarah di IPB, menawarkan nuansa akademik yang kental dengan kapasitas yang cukup luas untuk berbagai acara.",
                    "location": "Fakultas Pertanian",
                    "campus": "Dramaga",
                    "category": "Auditorium",
                    "capacity": 200,
                    "status": "AVAILABLE",
                    "tags": "DRAMAGA,AUDITORIUM",
                    "image": "/images/toyib.png"
                },
                {
                    "name": "Ruang Kuliah Umum CCR",
                    "description": "Ruang kelas umum yang terletak di gedung CCR, dirancang untuk kenyamanan proses belajar mengajar dengan fasilitas audio visual lengkap.",
                    "location": "Common Class Room",
                    "campus": "Dramaga",
                    "category": "Ruang Kelas",
                    "capacity": 100,
                    "status": "AVAILABLE",
                    "tags": "DRAMAGA,ROOM",
                    "image": "/images/ccr.png"
                },
                {
                    "name": "Auditorium GMSK",
                    "description": "Auditorium Departemen Gizi Masyarakat dan Sumberdaya Keluarga, FEMA IPB.",
                    "location": "FEMA Lantai 3",
                    "campus": "Dramaga",
                    "category": "Auditorium",
                    "capacity": 250,
                    "status": "AVAILABLE",
                    "tags": "DRAMAGA,AUDITORIUM",
                    "image": "/images/IPB-fasilitas.png"
                },
                {
                    "name": "Ruang Seminar 2.01",
                    "description": "Ruang Seminar Fakultas Teknologi Pertanian dengan audio visual lengkap.",
                    "location": "FATETA Gedung F, Lantai 2",
                    "campus": "Dramaga",
                    "category": "Ruang Kelas",
                    "capacity": 50,
                    "status": "AVAILABLE",
                    "tags": "DRAMAGA,ROOM",
                    "image": "/images/IPB-fasilitas.png"
                },
                {
                    "name": "Gymnasium IPB",
                    "description": "Gedung olahraga serbaguna IPB untuk berbagai aktivitas olahraga dan seni.",
                    "location": "Kampus Dramaga Barat",
                    "campus": "Dramaga",
                    "category": "Gymnasium",
                    "capacity": 1500,
                    "status": "AVAILABLE",
                    "tags": "DRAMAGA,GYM",
                    "image": "/images/IPB-fasilitas.png"
                },
                {
                    "name": "Lab Komputer Lt. 3",
                    "description": "Laboratorium komputer modern untuk pengujian dan praktikum departemen Ilmu Komputer.",
                    "location": "FMIPA Gedung Ilmu Komputer",
                    "campus": "Dramaga",
                    "category": "Lab Komputer",
                    "capacity": 60,
                    "status": "AVAILABLE",
                    "tags": "DRAMAGA,LAB",
                    "image": "/images/IPB-fasilitas.png"
                }
            ]

            for fac_data in facilities_data:
                session.add(FacilityORM(**fac_data))
            session.commit()
            print("Facilities seeded.")

            # 2. Seed Users
            users_data = [
                {"id": "mock_uid_123", "email": "user@apps.ipb.ac.id", "role": "USER"},
                {"id": "mock_admin_uid_123", "email": "admin@apps.ipb.ac.id", "role": "ADMIN"}
            ]

            for u_data in users_data:
                session.add(UserORM(**u_data))
            session.commit()
            print("Users seeded.")

            # 3. Seed Reservations
            # Map facility names to IDs
            fac_map = {}
            for name in ["Auditorium GMSK", "Ruang Seminar 2.01", "Gymnasium IPB", "Lab Komputer Lt. 3", "Auditorium Andi Hakim Nasoetion"]:
                fac = session.exec(select(FacilityORM).where(FacilityORM.name == name)).first()
                if fac:
                    fac_map[name] = fac

            # Remove mock reservations completely for presentation readiness
            reservations = []
            if reservations:
                session.add_all(reservations)
                session.commit()
                print("Mock reservations seeded.")
            else:
                print("No mock reservations seeded. Database is clean for presentation.")

            # 4. Seed Notifications
            # Remove mock notifications
            notifications = []
            if notifications:
                session.add_all(notifications)
                session.commit()
                print("Mock notifications seeded.")
            else:
                print("No mock notifications seeded.")

if __name__ == "__main__":
    seeder = Seeder(engine)
    seeder.seed_all()
