import { useEffect, useState } from "react";
import { useReservations } from "../../context/ReservationContext";
import { format } from "date-fns";

function ReservationsPanel() {
  const {
    reservations,
    loading,
    getReservations,
    updateReservationStatus,
    markAttendance,
  } = useReservations();
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    getReservations();
  }, []);

  const handleStatusChange = async (reservationId, status) => {
    await updateReservationStatus(reservationId, status);
  };

  const handleAttendance = async (reservationId, attended) => {
    await markAttendance(reservationId, attended);
  };

  if (loading) return <div>Loading reservations...</div>;

  return (
    <div className="reservations-panel">
      <h2>Reservations Management</h2>
      <div className="date-filter">
        <label>Filter by date: </label>
        <input
          type="date"
          value={format(selectedDate, "yyyy-MM-dd")}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
      </div>

      <div className="reservations-list">
        {reservations
          .filter(
            (res) =>
              new Date(res.reservationDate).toDateString() ===
              selectedDate.toDateString()
          )
          .map((reservation) => (
            <div key={reservation._id} className="reservation-card">
              <h3>Room: {reservation.room?.roomName}</h3>
              <p>Seat: {reservation.seat?.number}</p>
              <p>User: {reservation.user?.username}</p>
              <p>
                Date:{" "}
                {new Date(reservation.reservationDate).toLocaleDateString()}
              </p>
              <p>
                Time: {reservation.timeSlot.startTime} -{" "}
                {reservation.timeSlot.endTime}
              </p>
              <p>Status: {reservation.status}</p>

              <div className="reservation-actions">
                {reservation.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusChange(reservation._id, "approved")
                      }
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(reservation._id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  </>
                )}

                {reservation.status === "approved" && (
                  <button
                    onClick={() => handleAttendance(reservation._id, true)}
                  >
                    Mark as Attended
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ReservationsPanel;
