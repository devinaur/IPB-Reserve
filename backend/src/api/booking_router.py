from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from ..db import get_session
from ..repositories.booking_repo import BookingRepository
from ..services.booking_service import BookingService
from ..schemas.booking import BookingCreate, BookingOut

router = APIRouter(prefix="/bookings", tags=["bookings"])


def get_service(session: Session = Depends(get_session)) -> BookingService:
    repo = BookingRepository(session)
    return BookingService(repo)


@router.post("/", response_model=BookingOut, status_code=201)
def create_booking(payload: BookingCreate, svc: BookingService = Depends(get_service)):
    try:
        b = svc.create_booking(payload.facility_id, payload.user_id, payload.starts_at, payload.ends_at)
        return BookingOut(**b.__dict__)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/facility/{facility_id}", response_model=List[BookingOut])
def list_facility_bookings(facility_id: int, svc: BookingService = Depends(get_service)):
    items = svc.list_for_facility(facility_id)
    return [BookingOut(**i.__dict__) for i in items]


@router.get("/user/{user_id}", response_model=List[BookingOut])
def list_user_bookings(user_id: int, svc: BookingService = Depends(get_service)):
    items = svc.list_by_user(user_id)
    return [BookingOut(**i.__dict__) for i in items]
