from typing import List, Optional

from ..models.facility import Facility
from ..models.user import User
from ..repositories.facility_repo import FacilityRepository


class FacilityService:
    def __init__(self, repo: FacilityRepository):
        self.repo = repo

    def list_facilities(self) -> List[Facility]:
        return self.repo.list_all()

    def get_facility(self, facility_id: int) -> Optional[Facility]:
        return self.repo.get_by_id(facility_id)

    def create_facility(
        self,
        current_user: User,
        name: str,
        description: Optional[str] = None,
        location: Optional[str] = None,
        campus: Optional[str] = "Dramaga",
        category: Optional[str] = "Auditorium",
        capacity: Optional[int] = None,
        status: Optional[str] = "AVAILABLE",
        image: Optional[str] = None,
        tags: Optional[str] = None,
    ) -> Facility:
        self._ensure_admin(current_user)
        if self.repo.find_by_name(name):
            raise ValueError("A facility with that name already exists.")
        return self.repo.create(
            name=name,
            description=description,
            location=location,
            campus=campus,
            category=category,
            capacity=capacity,
            status=status,
            image=image,
            tags=tags,
        )

    def update_facility(
        self,
        current_user: User,
        facility_id: int,
        name: Optional[str] = None,
        description: Optional[str] = None,
        location: Optional[str] = None,
        campus: Optional[str] = None,
        category: Optional[str] = None,
        capacity: Optional[int] = None,
        status: Optional[str] = None,
        image: Optional[str] = None,
        tags: Optional[str] = None,
    ) -> Facility:
        self._ensure_admin(current_user)
        facility = self.repo.get_by_id(facility_id)
        if not facility:
            raise ValueError("Facility not found.")
        return self.repo.update(
            facility_id=facility_id,
            name=name,
            description=description,
            location=location,
            campus=campus,
            category=category,
            capacity=capacity,
            status=status,
            image=image,
            tags=tags,
        )

    def delete_facility(self, current_user: User, facility_id: int) -> None:
        self._ensure_admin(current_user)
        if not self.repo.get_by_id(facility_id):
            raise ValueError("Facility not found.")
        self.repo.delete(facility_id)

    def _ensure_admin(self, current_user: User) -> None:
        if not current_user.is_admin():
            raise PermissionError("Admin privileges required.")
