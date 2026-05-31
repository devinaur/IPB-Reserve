from datetime import date, datetime
from typing import List, Optional

from ..models.reservation import Reservation, ReservationStatus
from ..models.user import User
from ..repositories.facility_repo import FacilityRepository
from ..repositories.reservation_repo import ReservationRepository


class ReservationService:
    def __init__(self, reservation_repo: ReservationRepository, facility_repo: FacilityRepository):
        self.reservation_repo = reservation_repo
        self.facility_repo = facility_repo

    def create_reservation(
        self,
        user: User,
        facility_id: int,
        start_date: datetime,
        end_date: datetime,
        purpose: str
    ) -> Reservation:
        if start_date >= end_date:
            raise ValueError("Reservation end date must be after start date.")

        today = datetime.utcnow()
        if start_date < today:
            raise ValueError("Reservations cannot start in the past.")

        facility = self.facility_repo.get_by_id(facility_id)
        if not facility:
            raise ValueError("Facility not found.")

        overlaps = self.reservation_repo.find_overlapping_approved(facility_id, start_date, end_date)
        if overlaps:
            raise ValueError("Reservation overlaps with an existing approved reservation.")

        res = self.reservation_repo.create(
            user_id=user.id, 
            facility_id=facility_id, 
            facility_name=facility.name,
            start_date=start_date, 
            end_date=end_date,
            purpose=purpose
        )
        self._send_notification(
            user_id="admin",
            title="Pengajuan Reservasi Baru",
            message=f"Pengajuan baru dari {user.email} untuk {facility.name}.",
            link="/admin/pengajuan"
        )
        return res

    def list_user_reservations(self, user: User) -> List[Reservation]:
        return self.reservation_repo.list_by_user(user.id)

    def list_all_reservations(self, current_user: User) -> List[Reservation]:
        self._ensure_admin(current_user)
        return self.reservation_repo.list_all()

    def update_reservation_status(self, current_user: User, reservation_id: int, status: ReservationStatus, rejection_reason: Optional[str] = None) -> Reservation:
        self._ensure_admin(current_user)
        reservation = self.reservation_repo.get_by_id(reservation_id)
        if not reservation:
            raise ValueError("Reservation not found.")
        res = self.reservation_repo.update_status(reservation_id, status, rejection_reason)
        
        # Sync facility status
        if status == ReservationStatus.APPROVED:
            self.facility_repo.update(facility_id=reservation.facility_id, status="BOOKED")
        elif status == ReservationStatus.REJECTED:
            # Revert to AVAILABLE if currently BOOKED
            fac = self.facility_repo.get_by_id(reservation.facility_id)
            if fac and fac.status == "BOOKED":
                self.facility_repo.update(facility_id=reservation.facility_id, status="AVAILABLE")

        status_label = "disetujui" if status == ReservationStatus.APPROVED else "ditolak"
        msg = f"Pengajuan reservasi Anda untuk {reservation.facility_name} telah {status_label}."
        if status == ReservationStatus.REJECTED and rejection_reason:
            msg += f" Alasan: {rejection_reason}"
            
        self._send_notification(
            user_id=reservation.user_id,
            title=f"Pengajuan Reservasi {status_label.capitalize()}",
            message=msg,
            link="/pengajuan-saya"
        )
        return res

    def report_damage(self, current_user: User, reservation_id: int, damage_report: str) -> Reservation:
        self._ensure_admin(current_user)
        reservation = self.reservation_repo.get_by_id(reservation_id)
        if not reservation:
            raise ValueError("Reservation not found.")
        
        res = self.reservation_repo.update_damage_report(reservation_id, damage_report)
        
        # Update facility status to MAINTENANCE
        self.facility_repo.update(facility_id=reservation.facility_id, status="MAINTENANCE")
        
        # Send notification to the user
        self._send_notification(
            user_id=reservation.user_id,
            title="Laporan Kerusakan Fasilitas",
            message=f"Ada laporan kerusakan setelah peminjaman Anda untuk {reservation.facility_name}. Detail: {damage_report}",
            link="/riwayat"
        )
        return res

    def _send_notification(self, user_id: str, title: str, message: str, link: str = None):
        from ..repositories.notification_repo import NotificationRepository
        repo = NotificationRepository(self.reservation_repo.session)
        repo.create(user_id=user_id, title=title, message=message, link=link)

    def cancel_reservation(self, current_user: User, reservation_id: int) -> bool:
        reservation = self.reservation_repo.get_by_id(reservation_id)
        if not reservation:
            raise ValueError("Reservation not found.")
        
        # Check if user owns the reservation or is admin
        if reservation.user_id != current_user.id and not current_user.is_admin():
            raise PermissionError("You can only cancel your own reservations.")
            
        # Revert facility status to AVAILABLE if it was approved and currently booked
        if reservation.status == ReservationStatus.APPROVED:
            fac = self.facility_repo.get_by_id(reservation.facility_id)
            if fac and fac.status == "BOOKED":
                self.facility_repo.update(facility_id=reservation.facility_id, status="AVAILABLE")

        return self.reservation_repo.delete(reservation_id)

    def _ensure_admin(self, current_user: User) -> None:
        if not current_user.is_admin():
            raise PermissionError("Admin privileges required.")
