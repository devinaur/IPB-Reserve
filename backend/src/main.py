import os
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from dotenv import load_dotenv

from .database.db import init_db, engine
from .middleware.firebase_auth import init_firebase
from .repositories.user_repo import UserRepository
from .services.user_service import UserService
from .routes.facility_router import router as facility_router
from .routes.reservation_router import router as reservation_router
from .routes.notification_router import router as notification_router

load_dotenv()

class CampusReservationApp:
    def __init__(self):
        self.app = FastAPI(title="Campus Facility Reservation API", redirect_slashes=False)
        self._setup_middleware()
        self._setup_events()
        self._setup_routes()

    def _setup_middleware(self):
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],  # For development, allow all. You can restrict to ["http://localhost:5173"]
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    def _setup_routes(self):
        @self.app.get("/", response_class=HTMLResponse)
        def index():
            return "<h1>Campus Facility Reservation API</h1><p>Open <a href=\"/docs\">/docs</a> for API docs.</p>"

        self.app.include_router(facility_router, prefix="/api")
        self.app.include_router(reservation_router, prefix="/api")
        self.app.include_router(notification_router, prefix="/api")

    def _setup_events(self):
        @self.app.on_event("startup")
        def on_startup():
            init_db()
            init_firebase()
            admin_emails = [email.strip() for email in os.getenv("INITIAL_ADMIN_EMAILS", "").split(",") if email.strip()]
            if admin_emails:
                with Session(engine) as session:
                    UserService(UserRepository(session)).seed_initial_admins(admin_emails)

app = CampusReservationApp().app
