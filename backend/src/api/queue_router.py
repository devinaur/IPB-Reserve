from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from ..db import get_session
from ..repositories.queue_repo import QueueRepository
from ..services.queue_service import QueueService
from ..schemas.queue import QueueCreate, QueueOut

router = APIRouter(prefix="/queues", tags=["queues"])


def get_service(session: Session = Depends(get_session)) -> QueueService:
    repo = QueueRepository(session)
    return QueueService(repo)


@router.post("/", response_model=QueueOut, status_code=201)
def join_queue(payload: QueueCreate, svc: QueueService = Depends(get_service)):
    item = svc.join_queue(payload.facility_id, payload.user_id)
    return QueueOut(**item.__dict__)


@router.get("/{facility_id}", response_model=List[QueueOut])
def list_queue(facility_id: int, svc: QueueService = Depends(get_service)):
    # reuse repository via service for listing
    repo = svc.repo
    items = repo.list_for_facility(facility_id)
    return [QueueOut(**i.__dict__) for i in items]


@router.post("/{facility_id}/pop", response_model=QueueOut)
def pop_next(facility_id: int, svc: QueueService = Depends(get_service)):
    item = svc.pop_next(facility_id)
    if not item:
        raise HTTPException(status_code=404, detail="No queued items")
    return QueueOut(**item.__dict__)
