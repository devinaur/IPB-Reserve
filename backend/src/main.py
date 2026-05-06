import os
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from .db import init_db, engine
from .middleware.firebase_auth import init_firebase
from .repositories.user_repo import UserRepository
from .services.user_service import UserService
from .api.facility_router import router as facility_router
from .api.reservation_router import router as reservation_router
from sqlmodel import Session
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Campus Facility Reservation API")


@app.on_event("startup")
def on_startup():
    init_db()
    init_firebase()
    admin_emails = [email.strip() for email in os.getenv("INITIAL_ADMIN_EMAILS", "").split(",") if email.strip()]
    if admin_emails:
        with Session(engine) as session:
            UserService(UserRepository(session)).seed_initial_admins(admin_emails)


@app.get("/", response_class=HTMLResponse)
def index():
    return "<h1>Campus Facility Reservation API</h1><p>Open <a href=\"/docs\">/docs</a> for API docs.</p>"


app.include_router(facility_router)
app.include_router(reservation_router)
