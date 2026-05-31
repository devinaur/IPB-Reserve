from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from ..database.db import get_session
from ..middleware.firebase_auth import get_current_user_token
from ..repositories.notification_repo import NotificationRepository
from ..repositories.user_repo import UserRepository
from ..schemas.notification import NotificationOut
from ..services.notification_service import NotificationService
from ..services.user_service import UserService

def get_notification_service(session: Session = Depends(get_session)) -> NotificationService:
    repo = NotificationRepository(session)
    return NotificationService(repo)

def get_user_service(session: Session = Depends(get_session)) -> UserService:
    return UserService(UserRepository(session))

def _build_user(token_data: dict, user_service: UserService):
    if not token_data:
        raise HTTPException(status_code=401, detail="Authentication required.")
    return user_service.ensure_user_exists(uid=token_data["uid"], email=token_data["email"])


class NotificationRouter:
    def __init__(self):
        self.router = APIRouter(prefix="/notifications", tags=["notifications"])
        self._setup_routes()

    def _setup_routes(self):
        self.router.add_api_route("", self.list_my_notifications, methods=["GET"], response_model=List[NotificationOut])
        self.router.add_api_route("/read-all", self.mark_all_read, methods=["PUT"], status_code=204)
        self.router.add_api_route("/{notification_id}/read", self.mark_read, methods=["PUT"], response_model=NotificationOut)

    def list_my_notifications(
        self,
        token_data: dict = Depends(get_current_user_token),
        svc: NotificationService = Depends(get_notification_service),
        user_service: UserService = Depends(get_user_service)
    ):
        current_user = _build_user(token_data, user_service)
        notifications = svc.list_user_notifications(current_user)
        return [NotificationOut(**n.dict()) for n in notifications]

    def mark_read(
        self,
        notification_id: int,
        token_data: dict = Depends(get_current_user_token),
        svc: NotificationService = Depends(get_notification_service),
        user_service: UserService = Depends(get_user_service)
    ):
        current_user = _build_user(token_data, user_service)
        notification = svc.mark_notification_as_read(current_user, notification_id)
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found.")
        return NotificationOut(**notification.dict())

    def mark_all_read(
        self,
        token_data: dict = Depends(get_current_user_token),
        svc: NotificationService = Depends(get_notification_service),
        user_service: UserService = Depends(get_user_service)
    ):
        current_user = _build_user(token_data, user_service)
        svc.mark_all_user_notifications_read(current_user)
        return None

router = NotificationRouter().router
