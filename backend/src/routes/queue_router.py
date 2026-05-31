from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from ..database.db import get_session
from ..repositories.queue_repo import QueueRepository
from ..services.queue_service import QueueService
from ..schemas.queue import QueueCreate, QueueOut

def get_service(session: Session = Depends(get_session)) -> QueueService:
    repo = QueueRepository(session)
    return QueueService(repo)

class QueueRouter:
    def __init__(self):
        self.router = APIRouter(prefix="/queues", tags=["queues"])
        self._setup_routes()

    def _setup_routes(self):
        self.router.add_api_route("/", self.join_queue, methods=["POST"], response_model=QueueOut, status_code=201)
        self.router.add_api_route("/{facility_id}", self.list_queue, methods=["GET"], response_model=List[QueueOut])
        self.router.add_api_route("/{facility_id}/pop", self.pop_next, methods=["POST"], response_model=QueueOut)

    def join_queue(self, payload: QueueCreate, svc: QueueService = Depends(get_service)):
        item = svc.join_queue(payload.facility_id, payload.user_id)
        return QueueOut(**item.__dict__)

    def list_queue(self, facility_id: int, svc: QueueService = Depends(get_service)):
        # reuse repository via service for listing
        repo = svc.repo
        items = repo.list_for_facility(facility_id)
        return [QueueOut(**i.__dict__) for i in items]

    def pop_next(self, facility_id: int, svc: QueueService = Depends(get_service)):
        item = svc.pop_next(facility_id)
        if not item:
            raise HTTPException(status_code=404, detail="No queued items")
        return QueueOut(**item.__dict__)

router = QueueRouter().router
