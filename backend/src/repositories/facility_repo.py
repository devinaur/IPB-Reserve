from sqlmodel import Session, select
from typing import List, Optional

from ..models.facility_orm import FacilityORM
from ..models.facility import Facility


class FacilityRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(
        self,
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
        orm = FacilityORM(
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
        self.session.add(orm)
        self.session.commit()
        self.session.refresh(orm)
        return self._to_domain(orm)

    def list_all(self) -> List[Facility]:
        stmt = select(FacilityORM)
        results = self.session.exec(stmt).all()
        return [self._to_domain(r) for r in results]

    def get_by_id(self, facility_id: int) -> Optional[Facility]:
        orm = self.session.get(FacilityORM, facility_id)
        return self._to_domain(orm) if orm else None

    def find_by_name(self, name: str) -> Optional[Facility]:
        stmt = select(FacilityORM).where(FacilityORM.name == name)
        orm = self.session.exec(stmt).one_or_none()
        return self._to_domain(orm) if orm else None

    def update(
        self,
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
        orm = self.session.get(FacilityORM, facility_id)
        if orm is None:
            raise ValueError("Facility not found.")
        if name is not None:
            orm.name = name
        if description is not None:
            orm.description = description
        if location is not None:
            orm.location = location
        if campus is not None:
            orm.campus = campus
        if category is not None:
            orm.category = category
        if capacity is not None:
            orm.capacity = capacity
        if status is not None:
            orm.status = status
        if image is not None:
            orm.image = image
        if tags is not None:
            orm.tags = tags
        self.session.add(orm)
        self.session.commit()
        self.session.refresh(orm)
        return self._to_domain(orm)

    def delete(self, facility_id: int) -> None:
        orm = self.session.get(FacilityORM, facility_id)
        if orm:
            self.session.delete(orm)
            self.session.commit()

    def _to_domain(self, orm: FacilityORM) -> Facility:
        return Facility(
            id=orm.id,
            name=orm.name,
            description=orm.description,
            location=orm.location,
            campus=orm.campus,
            category=orm.category,
            capacity=orm.capacity,
            status=orm.status,
            image=orm.image,
            tags=orm.tags,
        )
