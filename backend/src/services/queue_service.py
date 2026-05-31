from typing import Optional
from ..repositories.queue_repo import QueueRepository
from ..models.queue import QueueItem


class QueueService:
    def __init__(self, repo: QueueRepository):
        self.repo = repo

    def join_queue(self, facility_id: int, user_id: int) -> QueueItem:
        return self.repo.enqueue(facility_id, user_id)

    def next_in_queue(self, facility_id: int) -> Optional[QueueItem]:
        return self.repo.peek_oldest(facility_id)

    def pop_next(self, facility_id: int) -> Optional[QueueItem]:
        item = self.repo.peek_oldest(facility_id)
        if item:
            self.repo.dequeue(item.id)
        return item
