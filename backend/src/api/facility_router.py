from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from ..db import get_session
from ..middleware.firebase_auth import get_current_user_token
from ..repositories.facility_repo import FacilityRepository
from ..repositories.user_repo import UserRepository
from ..schemas.facility import FacilityCreate, FacilityOut, FacilityUpdate
from ..services.facility_service import FacilityService
from ..services.user_service import UserService

router = APIRouter(prefix="/facilities", tags=["facilities"])


def get_service(session: Session = Depends(get_session)) -> FacilityService:
    repo = FacilityRepository(session)
    return FacilityService(repo)


def get_user_service(session: Session = Depends(get_session)) -> UserService:
    return UserService(UserRepository(session))


def _build_user(token_data: dict, user_service: UserService):
    if not token_data:
        raise HTTPException(status_code=401, detail="Authentication required.")
    return user_service.ensure_user_exists(uid=token_data["uid"], email=token_data["email"])

@router.get("/", response_model=List[FacilityOut])
def list_facilities(svc: FacilityService = Depends(get_service)):
    facilities = svc.list_facilities()
    return [FacilityOut(**facility.__dict__) for facility in facilities]


@router.post("/", response_model=FacilityOut, status_code=201)
def create_facility(
    payload: FacilityCreate,
    token_data: dict = Depends(get_current_user_token),
    svc: FacilityService = Depends(get_service),
    user_service: UserService = Depends(get_user_service),
):
    try:
        current_user = _build_user(token_data, user_service)
        facility = svc.create_facility(
            current_user=current_user,
            name=payload.name,
            description=payload.description,
            location=payload.location,
            capacity=payload.capacity,
        )
        return FacilityOut(**facility.__dict__)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail=str(exc))


@router.put("/{facility_id}", response_model=FacilityOut)
def update_facility(
    facility_id: int,
    payload: FacilityUpdate,
    token_data: dict = Depends(get_current_user_token),
    svc: FacilityService = Depends(get_service),
    user_service: UserService = Depends(get_user_service),
):
    try:
        current_user = _build_user(token_data, user_service)
        facility = svc.update_facility(
            current_user=current_user,
            facility_id=facility_id,
            name=payload.name,
            description=payload.description,
            location=payload.location,
            capacity=payload.capacity,
        )
        return FacilityOut(**facility.__dict__)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail=str(exc))


@router.delete("/{facility_id}", status_code=204)
def delete_facility(
    facility_id: int,
    token_data: dict = Depends(get_current_user_token),
    svc: FacilityService = Depends(get_service),
    user_service: UserService = Depends(get_user_service),
):
    try:
        current_user = _build_user(token_data, user_service)
        svc.delete_facility(current_user=current_user, facility_id=facility_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail=str(exc))
