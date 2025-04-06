import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoomCard({ room, onEdit, onDelete }) {
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "watchman";

  return (
    <div className="room-card">
      <h3>{room.roomName}</h3>
      <p>{room.roomDescription}</p>
      <p>Type: {room.roomType}</p>
      <p>Seats: {room.seats?.length || 0}</p>

      <div className="room-actions">
        <Link to={`/rooms/${room._id}`} className="view-button">
          View Details
        </Link>

        {user?.role === "student" && (
          <Link to={`/make-reservation/${room._id}`} className="reserve-button">
            Make Reservation
          </Link>
        )}

        {canManage && (
          <>
            <Link
              to={`/room-reservations/${room._id}`}
              className="view-reservations-button"
            >
              View Reservations
            </Link>

            <button onClick={() => onEdit(room)} className="edit-button">
              Edit
            </button>

            {user?.role === "admin" && (
              <button
                onClick={() => onDelete(room._id)}
                className="delete-button"
              >
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RoomCard;
