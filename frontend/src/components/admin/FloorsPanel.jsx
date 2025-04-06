import { useEffect, useState } from "react";
import { useBuildings } from "../../context/BuildingContext";
import FloorForm from "./FloorForm";

function FloorsPanel() {
  const { buildings, loading, getBuildings } = useBuildings();
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState("");

  useEffect(() => {
    getBuildings();
  }, []);

  const handleEdit = (floor) => {
    setSelectedFloor(floor);
    setShowForm(true);
  };

  const getBuildingName = (buildingId) => {
    const building = buildings.find((b) => b._id === buildingId);
    return building ? building.buildingName : "Unknown Building";
  };

  if (loading) return <div>Loading floors data...</div>;

  return (
    <div className="floors-panel">
      <h2>Floors Management</h2>

      <div className="filter-section">
        <label>Filter by Building: </label>
        <select
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
        >
          <option value="">All Buildings</option>
          {buildings.map((building) => (
            <option key={building._id} value={building._id}>
              {building.buildingName}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => {
          setSelectedFloor(null);
          setShowForm(true);
        }}
        className="add-button"
      >
        Add New Floor
      </button>

      {showForm && (
        <FloorForm
          floor={selectedFloor}
          buildings={buildings}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="floors-list">
        {buildings.flatMap((building) =>
          building.floors
            ?.filter(
              (floor) => !selectedBuilding || building._id === selectedBuilding
            )
            ?.map((floor) => (
              <div key={floor._id} className="floor-card">
                <h3>Floor {floor.numberFloor}</h3>
                <p>Building: {getBuildingName(building._id)}</p>
                <p>Rooms: {floor.rooms?.length || 0}</p>
                <div className="floor-actions">
                  <button
                    onClick={() =>
                      handleEdit({ ...floor, building: building._id })
                    }
                    className="edit-button"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default FloorsPanel;
