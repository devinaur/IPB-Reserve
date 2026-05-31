from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from typing import List

from ..database.db import get_session
from ..middleware.firebase_auth import get_current_user_token
from ..repositories.facility_repo import FacilityRepository
from ..repositories.reservation_repo import ReservationRepository
from ..repositories.user_repo import UserRepository
from ..schemas.reservation import ReservationCreate, ReservationOut, ReservationStatusUpdate, ReservationDamageReport
from ..services.reservation_service import ReservationService
from ..services.user_service import UserService
from ..models.reservation import ReservationStatus
from ..models.reservation_orm import ReservationORM

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

class ReservationRouter:
    def __init__(self):
        self.router = APIRouter(prefix="/reservations", tags=["reservations"])
        self._setup_routes()

    def _setup_routes(self):
        self.router.add_api_route("/stats", self.get_reservation_stats, methods=["GET"])
        self.router.add_api_route("", self.create_reservation, methods=["POST"], response_model=ReservationOut, status_code=201)
        self.router.add_api_route("/me", self.list_my_reservations, methods=["GET"], response_model=List[ReservationOut])
        self.router.add_api_route("", self.list_all_reservations, methods=["GET"], response_model=List[ReservationOut])
        self.router.add_api_route("/{reservation_id}/status", self.update_reservation_status, methods=["PUT"], response_model=ReservationOut)
        self.router.add_api_route("/{reservation_id}/damage", self.report_damage, methods=["PUT"], response_model=ReservationOut)
        self.router.add_api_route("/{reservation_id}", self.delete_reservation, methods=["DELETE"], status_code=204)

    def get_reservation_stats(
        self,
        token_data: dict = Depends(get_current_user_token),
        session: Session = Depends(get_session)
    ):
        uid = token_data["uid"]
        
        waiting = session.exec(select(func.count(ReservationORM.id)).where(ReservationORM.user_id == uid, ReservationORM.status == "MENUNGGU")).one()
        approved = session.exec(select(func.count(ReservationORM.id)).where(ReservationORM.user_id == uid, ReservationORM.status == "DISETUJUI")).one()
        total = session.exec(select(func.count(ReservationORM.id)).where(ReservationORM.user_id == uid)).one()
        
        return {
            "waiting": waiting,
            "approved": approved,
            "total": total
        }

    def create_reservation(
        self,
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
                payload.purpose
            )
            return ReservationOut(**reservation.dict())
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))
        except PermissionError as exc:
            raise HTTPException(status_code=403, detail=str(exc))

    def list_my_reservations(
        self,
        token_data: dict = Depends(get_current_user_token),
        svc: ReservationService = Depends(get_service),
        user_service: UserService = Depends(get_user_service),
    ):
        current_user = _build_user(token_data, user_service)
        return [ReservationOut(**r.dict()) for r in svc.list_user_reservations(current_user)]

    def list_all_reservations(
        self,
        token_data: dict = Depends(get_current_user_token),
        svc: ReservationService = Depends(get_service),
        user_service: UserService = Depends(get_user_service),
    ):
        try:
            current_user = _build_user(token_data, user_service)
            return [ReservationOut(**r.dict()) for r in svc.list_all_reservations(current_user)]
        except PermissionError as exc:
            raise HTTPException(status_code=403, detail=str(exc))

    def update_reservation_status(
        self,
        reservation_id: int,
        payload: ReservationStatusUpdate,
        token_data: dict = Depends(get_current_user_token),
        svc: ReservationService = Depends(get_service),
        user_service: UserService = Depends(get_user_service),
    ):
        try:
            current_user = _build_user(token_data, user_service)
            status_str = payload.status
            if status_str == "APPROVED":
                status = ReservationStatus.APPROVED
            elif status_str == "REJECTED":
                status = ReservationStatus.REJECTED
            else:
                status = ReservationStatus(status_str)
            reservation = svc.update_reservation_status(current_user, reservation_id, status, payload.rejection_reason)
            return ReservationOut(**reservation.dict())
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))
        except PermissionError as exc:
            raise HTTPException(status_code=403, detail=str(exc))

    def delete_reservation(
        self,
        reservation_id: int,
        token_data: dict = Depends(get_current_user_token),
        svc: ReservationService = Depends(get_service),
        user_service: UserService = Depends(get_user_service),
    ):
        try:
            current_user = _build_user(token_data, user_service)
            svc.cancel_reservation(current_user, reservation_id)
            return None
        except ValueError as exc:
            raise HTTPException(status_code=404, detail=str(exc))
        except PermissionError as exc:
            raise HTTPException(status_code=403, detail=str(exc))

    def report_damage(
        self,
        reservation_id: int,
        payload: ReservationDamageReport,
        token_data: dict = Depends(get_current_user_token),
        svc: ReservationService = Depends(get_service),
        user_service: UserService = Depends(get_user_service),
    ):
        try:
            current_user = _build_user(token_data, user_service)
            reservation = svc.report_damage(current_user, reservation_id, payload.damage_report)
            return ReservationOut(**reservation.dict())
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))
        except PermissionError as exc:
            raise HTTPException(status_code=403, detail=str(exc))

router = ReservationRouter().router
