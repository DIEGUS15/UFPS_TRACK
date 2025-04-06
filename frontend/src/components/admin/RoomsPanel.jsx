import { useEffect, useState } from "react";
import { useBuildings } from "../../context/BuildingContext";
import RoomForm from "./RoomForm";

function RoomsPanel() {
  const { buildings, loading, getBuildings } = useBuildings();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");

  useEffect(() => {
    getBuildings();
  }, []);

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setShowForm(true);
  };

  const getBuildingName = (buildingId) => {
    const building = buildings.find((b) => b._id === buildingId);
    return building ? building.buildingName : "Unknown Building";
  };

  const getFloorNumber = (buildingId, floorId) => {
    const building = buildings.find((b) => b._id === buildingId);
    if (!building) return "Unknown Floor";
    const floor = building.floors?.find((f) => f._id === floorId);
    return floor ? `Floor ${floor.numberFloor}` : "Unknown Floor";
  };

  if (loading) return <div>Loading rooms data...</div>;

  return (
    <div className="rooms-panel">
      <h2>Rooms Management</h2>

      <div className="filter-section">
        <div className="filter-group">
          <label>Building: </label>
          <select
            value={selectedBuilding}
            onChange={(e) => {
              setSelectedBuilding(e.target.value);
              setSelectedFloor("");
            }}
          >
            <option value="">All Buildings</option>
            {buildings.map((building) => (
              <option key={building._id} value={building._id}>
                {building.buildingName}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Floor: </label>
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            disabled={!selectedBuilding}
          >
            <option value="">All Floors</option>
            {selectedBuilding &&
              buildings
                .find((b) => b._id === selectedBuilding)
                ?.floors?.map((floor) => (
                  <option key={floor._id} value={floor._id}>
                    Floor {floor.numberFloor}
                  </option>
                ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => {
          setSelectedRoom(null);
          setShowForm(true);
        }}
        className="add-button"
      >
        Add New Room
      </button>

      {showForm && (
        <RoomForm
          room={selectedRoom}
          buildings={buildings}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="rooms-list">
        {buildings.flatMap((building) =>
          building.floors
            ?.filter(
              (floor) => !selectedBuilding || building._id === selectedBuilding
            )
            ?.filter((floor) => !selectedFloor || floor._id === selectedFloor)
            ?.flatMap((floor) =>
              floor.rooms?.map((room) => (
                <div key={room._id} className="room-card">
                  <h3>{room.roomName}</h3>
                  <p>Type: {room.roomType}</p>
                  <p>Building: {getBuildingName(building._id)}</p>
                  <p>Location: {getFloorNumber(building._id, floor._id)}</p>
                  <p>Seats: {room.seats?.length || 0}</p>
                  <div className="room-actions">
                    <button
                      onClick={() =>
                        handleEdit({
                          ...room,
                          floor: floor._id,
                          building: building._id,
                        })
                      }
                      className="edit-button"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )
        )}
      </div>
    </div>
  );
}

export default RoomsPanel;
