from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from ..database.db import get_session
from ..middleware.firebase_auth import get_current_user_token
from ..repositories.facility_repo import FacilityRepository
from ..repositories.user_repo import UserRepository
from ..schemas.facility import FacilityCreate, FacilityOut, FacilityUpdate
from ..services.facility_service import FacilityService
from ..services.user_service import UserService

def get_service(session: Session = Depends(get_session)) -> FacilityService:
    repo = FacilityRepository(session)
    return FacilityService(repo)

def get_user_service(session: Session = Depends(get_session)) -> UserService:
    return UserService(UserRepository(session))

def _build_user(token_data: dict, user_service: UserService):
    if not token_data:
        raise HTTPException(status_code=401, detail="Authentication required.")
    return user_service.ensure_user_exists(uid=token_data["uid"], email=token_data["email"])

class FacilityRouter:
    def __init__(self):
        self.router = APIRouter(prefix="/facilities", tags=["facilities"])
        self._setup_routes()

    def _setup_routes(self):
        self.router.add_api_route("", self.list_facilities, methods=["GET"], response_model=List[FacilityOut])
        self.router.add_api_route("/{facility_id}", self.get_facility, methods=["GET"], response_model=FacilityOut)
        self.router.add_api_route("", self.create_facility, methods=["POST"], response_model=FacilityOut, status_code=201)
        self.router.add_api_route("/{facility_id}", self.update_facility, methods=["PUT"], response_model=FacilityOut)
        self.router.add_api_route("/{facility_id}", self.delete_facility, methods=["DELETE"], status_code=204)

    def list_facilities(self, svc: FacilityService = Depends(get_service)):
        facilities = svc.list_facilities()
        return [FacilityOut(**facility.dict()) for facility in facilities]

    def get_facility(self, facility_id: int, svc: FacilityService = Depends(get_service)):
        facility = svc.get_facility(facility_id)
        if not facility:
            raise HTTPException(status_code=404, detail="Facility not found.")
        return FacilityOut(**facility.dict())

    def create_facility(
        self,
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
                campus=payload.campus,
                category=payload.category,
                capacity=payload.capacity,
                status=payload.status,
                image=payload.image,
                tags=payload.tags,
            )
            return FacilityOut(**facility.dict())
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))
        except PermissionError as exc:
            raise HTTPException(status_code=403, detail=str(exc))

    def update_facility(
        self,
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
                campus=payload.campus,
                category=payload.category,
                capacity=payload.capacity,
                status=payload.status,
                image=payload.image,
                tags=payload.tags,
            )
            return FacilityOut(**facility.dict())
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))
        except PermissionError as exc:
            raise HTTPException(status_code=403, detail=str(exc))

    def delete_facility(
        self,
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

router = FacilityRouter().router
