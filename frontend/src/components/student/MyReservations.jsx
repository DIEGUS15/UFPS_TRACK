import { useEffect } from "react";
import { useReservations } from "../../context/ReservationContext";
import { format } from "date-fns";

function MyReservations() {
  const { myReservations, loading, getMyReservations, cancelReservation } =
    useReservations();

  useEffect(() => {
    getMyReservations();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      await cancelReservation(id);
    }
  };

  if (loading) return <div>Loading your reservations...</div>;

  return (
    <div className="my-reservations">
      <h2>My Reservations</h2>
      {myReservations.length === 0 ? (
        <p>You don't have any reservations yet.</p>
      ) : (
        <div className="reservations-list">
          {myReservations.map((reservation) => (
            <div key={reservation._id} className="reservation-card">
              <h3>Room: {reservation.room?.roomName}</h3>
              <p>Seat: {reservation.seat?.number}</p>
              <p>
                Date:{" "}
                {format(new Date(reservation.reservationDate), "MMM dd, yyyy")}
              </p>
              <p>
                Time: {reservation.timeSlot.startTime} -{" "}
                {reservation.timeSlot.endTime}
              </p>
              <p>
                Status:
                <span className={`status-${reservation.status}`}>
                  {reservation.status}
                </span>
              </p>

              {reservation.status === "pending" && (
                <button
                  onClick={() => handleCancel(reservation._id)}
                  className="cancel-button"
                >
                  Cancel Reservation
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservations;
