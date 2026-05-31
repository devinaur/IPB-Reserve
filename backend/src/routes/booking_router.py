from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from ..database.db import get_session
from ..repositories.booking_repo import BookingRepository
from ..services.booking_service import BookingService
from ..schemas.booking import BookingCreate, BookingOut

def get_service(session: Session = Depends(get_session)) -> BookingService:
    repo = BookingRepository(session)
    return BookingService(repo)

class BookingRouter:
    def __init__(self):
        self.router = APIRouter(prefix="/bookings", tags=["bookings"])
        self._setup_routes()

    def _setup_routes(self):
        self.router.add_api_route("", self.create_booking, methods=["POST"], response_model=BookingOut, status_code=201)
        self.router.add_api_route("/facility/{facility_id}", self.list_facility_bookings, methods=["GET"], response_model=List[BookingOut])
        self.router.add_api_route("/user/{user_id}", self.list_user_bookings, methods=["GET"], response_model=List[BookingOut])

    def create_booking(self, payload: BookingCreate, svc: BookingService = Depends(get_service)):
        try:
            b = svc.create_booking(payload.facility_id, payload.user_id, payload.starts_at, payload.ends_at)
            return BookingOut(**b.__dict__)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    def list_facility_bookings(self, facility_id: int, svc: BookingService = Depends(get_service)):
        items = svc.list_for_facility(facility_id)
        return [BookingOut(**i.__dict__) for i in items]

    def list_user_bookings(self, user_id: int, svc: BookingService = Depends(get_service)):
        items = svc.list_by_user(user_id)
        return [BookingOut(**i.__dict__) for i in items]

router = BookingRouter().router
