from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from ..db import get_session
from ..middleware.firebase_auth import get_current_user_token
from ..repositories.facility_repo import FacilityRepository
from ..repositories.reservation_repo import ReservationRepository
from ..repositories.user_repo import UserRepository
from ..schemas.reservation import ReservationCreate, ReservationOut, ReservationStatusUpdate
from ..services.reservation_service import ReservationService
from ..services.user_service import UserService
from ..domain.reservation import ReservationStatus

router = APIRouter(prefix="/reservations", tags=["reservations"])


def get_service(session: Session = Depends(get_session)) -> ReservationService:
    reservation_repo = ReservationRepository(session)
    facility_repo = FacilityRepository(session)
    return ReservationService(reservation_repo, facility_repo)


def get_user_service(session: Session = Depends(get_session)) -> UserService:
    return UserService(UserRepository(session))


def _build_user(token_data: dict, user_service: UserService):
    if not token_data:
        raise HTTPException(status_code=401, detail="Authentication required.")
    return user_service.ensure_user_exists(uid=token_data["uid"], email=token_data["email"])

@router.post("/", response_model=ReservationOut, status_code=201)
def create_reservation(
    payload: ReservationCreate,
    token_data: dict = Depends(get_current_user_token),
    svc: ReservationService = Depends(get_service),
    user_service: UserService = Depends(get_user_service),
):
    try:
        current_user = _build_user(token_data, user_service)
        reservation = svc.create_reservation(
            current_user,
            payload.facility_id,
            payload.start_date,
            payload.end_date,
        )
        return ReservationOut(**reservation.__dict__)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail=str(exc))


@router.get("/me", response_model=List[ReservationOut])
def list_my_reservations(
    token_data: dict = Depends(get_current_user_token),
    svc: ReservationService = Depends(get_service),
    user_service: UserService = Depends(get_user_service),
):
    current_user = _build_user(token_data, user_service)
    return [ReservationOut(**r.__dict__) for r in svc.list_user_reservations(current_user)]


@router.get("/", response_model=List[ReservationOut])
def list_all_reservations(
    token_data: dict = Depends(get_current_user_token),
    svc: ReservationService = Depends(get_service),
    user_service: UserService = Depends(get_user_service),
):
    try:
        current_user = _build_user(token_data, user_service)
        return [ReservationOut(**r.__dict__) for r in svc.list_all_reservations(current_user)]
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail=str(exc))


@router.put("/{reservation_id}/status", response_model=ReservationOut)
def update_reservation_status(
    reservation_id: int,
    payload: ReservationStatusUpdate,
    token_data: dict = Depends(get_current_user_token),
    svc: ReservationService = Depends(get_service),
    user_service: UserService = Depends(get_user_service),
):
    try:
        current_user = _build_user(token_data, user_service)
        status = ReservationStatus(payload.status)
        reservation = svc.update_reservation_status(current_user, reservation_id, status)
        return ReservationOut(**reservation.__dict__)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail=str(exc))
