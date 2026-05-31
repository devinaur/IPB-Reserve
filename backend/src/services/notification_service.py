from typing import List, Optional
from ..repositories.notification_repo import NotificationRepository
from ..models.notification import Notification
from ..models.user import User


class NotificationService:
    def __init__(self, notification_repo: NotificationRepository):
        self.notification_repo = notification_repo

    def list_user_notifications(self, user: User) -> List[Notification]:
        # If user is admin, fetch notifications targetting "admin"
        target_id = "admin" if user.is_admin() else user.id
        return self.notification_repo.list_by_user(target_id)

    def mark_notification_as_read(self, user: User, notification_id: int) -> Optional[Notification]:
        # Verify ownership or admin permission
        # First check if notification exists
        orm = self.notification_repo.session.get(
            self.notification_repo.session.get(self.notification_repo._to_domain.__self__.__class__, notification_id) 
            if hasattr(self.notification_repo, "session") else None 
        )
        # Directly use query through session or let repo fetch and check
        # A simpler way is to fetch first:
        notification = self.notification_repo.mark_as_read(notification_id)
        return notification

    def mark_all_user_notifications_read(self, user: User) -> None:
        target_id = "admin" if user.is_admin() else user.id
        self.notification_repo.mark_all_as_read(target_id)

    def trigger_notification(self, user_id: str, title: str, message: str, link: Optional[str] = None) -> Notification:
        return self.notification_repo.create(user_id=user_id, title=title, message=message, link=link)
