import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";

function ReservationCard({
  reservation,
  onCancel,
  onUpdateStatus,
  onMarkAttendance,
}) {
  const { user } = useAuth();
  const [statusLoading, setStatusLoading] = useState(false);

  // Determinar si el usuario es estudiante o vigilante/admin
  const isStudent = user?.role === "student";
  const canManage = user?.role === "admin" || user?.role === "watchman";

  // Formatear la fecha
  const formattedDate = format(new Date(reservation.reservationDate), "PPP");

  // Determinar el color según el estado
  const getStatusColor = () => {
    switch (reservation.status) {
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "completed":
        return "status-completed";
      default:
        return "";
    }
  };

  // Manejar la actualización de estado
  const handleStatusChange = async (status) => {
    setStatusLoading(true);
    await onUpdateStatus(reservation._id, status);
    setStatusLoading(false);
  };

  // Manejar la asignación de computadora
  const handleAssignComputer = async () => {
    setStatusLoading(true);
    await onUpdateStatus(reservation._id, "approved", true);
    setStatusLoading(false);
  };

  return (
    <div className={`reservation-card ${getStatusColor()}`}>
      <div className="reservation-header">
        <h3>Reservation #{reservation._id.substring(0, 6)}</h3>
        <span className={`status-badge ${getStatusColor()}`}>
          {reservation.status}
        </span>
      </div>

      <div className="reservation-details">
        <p>
          <strong>Date:</strong> {formattedDate}
        </p>
        <p>
          <strong>Time:</strong> {reservation.timeSlot.startTime} -{" "}
          {reservation.timeSlot.endTime}
        </p>
        <p>
          <strong>Room:</strong> {reservation.room?.roomName || "N/A"}
        </p>
        <p>
          <strong>Seat:</strong> #{reservation.seat?.number || "N/A"}
        </p>

        {/* Mostrar detalles del usuario solo para vigilantes/admin */}
        {canManage && (
          <p>
            <strong>User:</strong>{" "}
            {reservation.user?.username || reservation.user?.email || "N/A"}
          </p>
        )}

        {/* Mostrar si tiene computador asignado */}
        {reservation.assignedComputer && (
          <p className="computer-assigned">Computer Assigned</p>
        )}
      </div>

      <div className="reservation-actions">
        {/* Acciones para estudiantes */}
        {isStudent &&
          reservation.status !== "completed" &&
          reservation.status !== "rejected" && (
            <button
              onClick={() => onCancel(reservation._id)}
              className="cancel-button"
            >
              Cancel Reservation
            </button>
          )}

        {/* Acciones para vigilantes/admin */}
        {canManage && (
          <div className="management-actions">
            {reservation.status === "pending" && (
              <>
                <button
                  onClick={() => handleStatusChange("approved")}
                  className="approve-button"
                  disabled={statusLoading}
                >
                  Approve
                </button>

                {reservation.seat?.hasComputer && (
                  <button
                    onClick={handleAssignComputer}
                    className="assign-computer-button"
                    disabled={statusLoading}
                  >
                    Approve & Assign Computer
                  </button>
                )}

                <button
                  onClick={() => handleStatusChange("rejected")}
                  className="reject-button"
                  disabled={statusLoading}
                >
                  Reject
                </button>
              </>
            )}

            {reservation.status === "approved" && (
              <button
                onClick={() => onMarkAttendance(reservation._id, true)}
                className="mark-attendance-button"
              >
                Mark as Attended
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReservationCard;
