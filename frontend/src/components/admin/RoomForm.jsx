import { useState, useEffect } from "react";
import { useBuildings } from "../../context/BuildingContext";

function RoomForm({ room, buildings, onClose }) {
  const { createRoom, updateRoom } = useBuildings();
  const [formData, setFormData] = useState({
    roomName: room?.roomName || "",
    roomDescription: room?.roomDescription || "",
    roomType: room?.roomType || "classroom",
    buildingId: room?.building || buildings[0]?._id || "",
    floorId: room?.floor || "",
    seatsCount: 0,
  });

  const [availableFloors, setAvailableFloors] = useState([]);

  useEffect(() => {
    if (formData.buildingId) {
      const building = buildings.find((b) => b._id === formData.buildingId);
      setAvailableFloors(building?.floors || []);
    }
  }, [formData.buildingId, buildings]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomData = {
      roomName: formData.roomName,
      roomDescription: formData.roomDescription,
      roomType: formData.roomType,
      floorId: formData.floorId,
      seatsCount: formData.seatsCount, // Asegúrate de incluir esto
    };

    try {
      if (room) {
        await updateRoom(room._id, roomData);
      } else {
        await createRoom(roomData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  return (
    <div className="room-form-modal">
      <div className="modal-content">
        <h3>{room ? "Edit Room" : "Create Room"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Room Name</label>
            <input
              type="text"
              name="roomName"
              value={formData.roomName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="roomDescription"
              value={formData.roomDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Room Type</label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              required
            >
              <option value="classroom">Classroom</option>
              <option value="auditorium">Auditorium</option>
              <option value="teacher's room">Teacher's Room</option>
            </select>
          </div>

          <div className="form-group">
            <label>Building</label>
            <select
              name="buildingId"
              value={formData.buildingId}
              onChange={handleChange}
              required
            >
              {buildings.map((building) => (
                <option key={building._id} value={building._id}>
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
              disabled={!formData.buildingId}
            >
              <option value="">Select a floor</option>
              {availableFloors.map((floor) => (
                <option key={floor._id} value={floor._id}>
                  Floor {floor.numberFloor}
                </option>
              ))}
            </select>
          </div>

          {!room && (
            <div className="form-group">
              <label>Number of Seats</label>
              <input
                type="number"
                name="seatsCount"
                value={formData.seatsCount}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="save-button">
              Save
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoomForm;
