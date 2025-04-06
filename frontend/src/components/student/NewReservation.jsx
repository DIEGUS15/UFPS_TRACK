import { useState, useEffect } from "react";
import { useBuildings } from "../../context/BuildingContext";
import { useReservations } from "../../context/ReservationContext";
import { format } from "date-fns";
import { getSeatsByRoomRequest } from "../../api/seats";

function NewReservation() {
  const { buildings, getBuildings } = useBuildings();
  const { createReservation } = useReservations();
  const [formData, setFormData] = useState({
    buildingId: "",
    floorId: "",
    roomId: "",
    seatId: "",
    reservationDate: format(new Date(), "yyyy-MM-dd"),
    timeSlot: { startTime: "09:00", endTime: "10:00" },
  });
  const [availableSeats, setAvailableSeats] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [availableFloors, setAvailableFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setLoading(true);
        await getBuildings();
        setError(null);
      } catch (err) {
        setError("Failed to load buildings data");
        console.error("Error loading buildings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuildings();
  }, []);

  useEffect(() => {
    if (formData.buildingId) {
      const building = buildings.find((b) => b._id === formData.buildingId);
      if (building) {
        setAvailableFloors(building.floors || []);
      } else {
        setAvailableFloors([]);
      }
    } else {
      setAvailableFloors([]);
    }
    // Reset dependent fields
    setFormData((prev) => ({
      ...prev,
      floorId: "",
      roomId: "",
      seatId: "",
    }));
  }, [formData.buildingId, buildings]);

  useEffect(() => {
    if (formData.floorId) {
      const floor = availableFloors.find((f) => f._id === formData.floorId);
      if (floor) {
        setAvailableRooms(floor.rooms || []);
      } else {
        setAvailableRooms([]);
      }
    } else {
      setAvailableRooms([]);
    }
    // Reset dependent fields
    setFormData((prev) => ({
      ...prev,
      roomId: "",
      seatId: "",
    }));
  }, [formData.floorId, availableFloors]);

  useEffect(() => {
    const fetchSeats = async () => {
      if (formData.roomId) {
        try {
          setLoading(true);
          const response = await getSeatsByRoomRequest(formData.roomId);
          setAvailableSeats(response.data);
          setError(null);
        } catch (err) {
          setError("Failed to load seats data");
          console.error("Error loading seats:", err);
          setAvailableSeats([]);
        } finally {
          setLoading(false);
        }
      } else {
        setAvailableSeats([]);
      }
      // Reset dependent field
      setFormData((prev) => ({
        ...prev,
        seatId: "",
      }));
    };

    fetchSeats();
  }, [formData.roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "startTime" || name === "endTime") {
      setFormData({
        ...formData,
        timeSlot: {
          ...formData.timeSlot,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createReservation({
        roomId: formData.roomId,
        seatId: formData.seatId,
        reservationDate: formData.reservationDate,
        timeSlot: formData.timeSlot,
      });

      // Reset form
      setFormData({
        buildingId: "",
        floorId: "",
        roomId: "",
        seatId: "",
        reservationDate: format(new Date(), "yyyy-MM-dd"),
        timeSlot: { startTime: "09:00", endTime: "10:00" },
      });

      setAvailableSeats([]);
      setError(null);
      alert("Reservation created successfully!");
    } catch (err) {
      setError("Failed to create reservation");
      console.error("Error creating reservation:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.buildingId) {
    return <div className="loading">Loading buildings data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="new-reservation">
      <h2>New Reservation</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Building</label>
          <select
            name="buildingId"
            value={formData.buildingId}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select a building</option>
            {buildings.map((building) => (
              <option key={`building-${building._id}`} value={building._id}>
                {building.buildingName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Floor</label>
          <select
            name="floorId"
            value={formData.floorId}
            onChange={handleChange}
            required
            disabled={!formData.buildingId || loading}
          >
            <option value="">Select a floor</option>
            {availableFloors.map((floor) => (
              <option key={`floor-${floor._id}`} value={floor._id}>
                Floor {floor.numberFloor}
              </option>
            ))}
          </select>
          {formData.buildingId && availableFloors.length === 0 && (
            <p className="info-text">No floors available in this building</p>
          )}
        </div>

        <div className="form-group">
          <label>Room</label>
          <select
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
            disabled={!formData.floorId || loading}
          >
            <option value="">Select a room</option>
            {availableRooms.map((room) => (
              <option key={`room-${room._id}`} value={room._id}>
                {room.roomName} ({room.roomType})
              </option>
            ))}
          </select>
          {formData.floorId && availableRooms.length === 0 && (
            <p className="info-text">No rooms available on this floor</p>
          )}
        </div>

        <div className="form-group">
          <label>Seat</label>
          <select
            name="seatId"
            value={formData.seatId}
            onChange={handleChange}
            required
            disabled={
              !formData.roomId || availableSeats.length === 0 || loading
            }
          >
            <option value="">Select a seat</option>
            {availableSeats.map((seat) => (
              <option key={`seat-${seat._id}`} value={seat._id}>
                Seat {seat.number} {seat.hasComputer ? "(Computer)" : ""}
                {seat.hasComputer &&
                  !seat.computerDetails?.isAvailable &&
                  " (Occupied)"}
              </option>
            ))}
          </select>
          {formData.roomId && availableSeats.length === 0 && !loading && (
            <p className="info-text">No seats available in this room</p>
          )}
          {loading && formData.roomId && (
            <p className="info-text">Loading seats...</p>
          )}
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="reservationDate"
            value={formData.reservationDate}
            onChange={handleChange}
            min={format(new Date(), "yyyy-MM-dd")}
            required
            disabled={loading}
          />
        </div>

        <div className="time-slots">
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.timeSlot.startTime}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.timeSlot.endTime}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={loading ? "submit-button loading" : "submit-button"}
        >
          {loading ? "Processing..." : "Make Reservation"}
        </button>
      </form>
    </div>
  );
}

export default NewReservation;
