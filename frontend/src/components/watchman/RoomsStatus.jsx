import { useEffect, useState } from "react";
import { useBuildings } from "../../context/BuildingContext";
import { useReservations } from "../../context/ReservationContext";
import { format } from "date-fns";

function RoomsStatus() {
  const { buildings, loading: buildingsLoading } = useBuildings();
  const { getRoomReservations } = useReservations();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [roomStatus, setRoomStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomStatus = async () => {
      setLoading(true);
      try {
        const statusData = [];

        // Recorrer todos los edificios, pisos y salas
        for (const building of buildings) {
          for (const floor of building.floors || []) {
            for (const room of floor.rooms || []) {
              // Obtener reservas para esta sala en la fecha seleccionada
              const reservations = await getRoomReservations(
                room._id,
                format(selectedDate, "yyyy-MM-dd")
              );

              // Calcular disponibilidad
              const occupiedSeats = reservations.filter(
                (r) => r.status === "approved" || r.status === "pending"
              ).length;

              const totalSeats = room.seats?.length || 0;
              const availableSeats = totalSeats - occupiedSeats;

              statusData.push({
                roomId: room._id,
                roomName: room.roomName,
                roomType: room.roomType,
                buildingName: building.buildingName,
                floorNumber: floor.numberFloor,
                totalSeats,
                availableSeats,
                occupiedSeats,
                reservations,
              });
            }
          }
        }

        setRoomStatus(statusData);
      } catch (error) {
        console.error("Error fetching room status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (buildings.length > 0) {
      fetchRoomStatus();
    }
  }, [buildings, selectedDate, getRoomReservations]);

  if (buildingsLoading || loading) return <div>Loading room status...</div>;

  return (
    <div className="rooms-status">
      <h2>Rooms Availability</h2>

      <div className="date-filter">
        <label>Date: </label>
        <input
          type="date"
          value={format(selectedDate, "yyyy-MM-dd")}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
      </div>

      <div className="rooms-list">
        {roomStatus.map((room) => (
          <div
            key={room.roomId}
            className={`room-card ${room.availableSeats === 0 ? "full" : ""}`}
          >
            <h3>
              {room.roomName} ({room.roomType})
            </h3>
            <p>
              Building: {room.buildingName}, Floor {room.floorNumber}
            </p>
            <div className="seats-info">
              <div className="seats-count">
                <span className="available">{room.availableSeats}</span> /
                <span className="total"> {room.totalSeats}</span> seats
                available
              </div>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{
                    width: `${(room.occupiedSeats / room.totalSeats) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="next-reservations">
              <h4>Upcoming Reservations:</h4>
              {room.reservations.length > 0 ? (
                <ul>
                  {room.reservations
                    .sort((a, b) =>
                      a.timeSlot.startTime.localeCompare(b.timeSlot.startTime)
                    )
                    .slice(0, 3)
                    .map((res) => (
                      <li key={res._id}>
                        {res.timeSlot.startTime}-{res.timeSlot.endTime}:{" "}
                        {res.user?.username}
                      </li>
                    ))}
                </ul>
              ) : (
                <p>No reservations for this date</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomsStatus;
