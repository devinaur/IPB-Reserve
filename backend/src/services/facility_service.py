from typing import List, Optional

from ..domain.facility import Facility
from ..domain.user import User
from ..repositories.facility_repo import FacilityRepository


class FacilityService:
    def __init__(self, repo: FacilityRepository):
        self.repo = repo

    def list_facilities(self) -> List[Facility]:
        return self.repo.list_all()

    def create_facility(
        self,
        current_user: User,
        name: str,
        description: Optional[str] = None,
        location: Optional[str] = None,
        capacity: Optional[int] = None,
    ) -> Facility:
        self._ensure_admin(current_user)
        if self.repo.find_by_name(name):
            raise ValueError("A facility with that name already exists.")
        return self.repo.create(name=name, description=description, location=location, capacity=capacity)

    def update_facility(
        self,
        current_user: User,
        facility_id: int,
        name: Optional[str] = None,
        description: Optional[str] = None,
        location: Optional[str] = None,
        capacity: Optional[int] = None,
    ) -> Facility:
        self._ensure_admin(current_user)
        facility = self.repo.get_by_id(facility_id)
        if not facility:
            raise ValueError("Facility not found.")
        return self.repo.update(facility_id, name, description, location, capacity)

    def delete_facility(self, current_user: User, facility_id: int) -> None:
        self._ensure_admin(current_user)
        if not self.repo.get_by_id(facility_id):
            raise ValueError("Facility not found.")
        self.repo.delete(facility_id)

    def _ensure_admin(self, current_user: User) -> None:
        if not current_user.is_admin():
            raise PermissionError("Admin privileges required.")
