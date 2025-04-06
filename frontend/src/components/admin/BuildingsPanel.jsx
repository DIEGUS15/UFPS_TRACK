import { useEffect, useState } from "react";
import { useBuildings } from "../../context/BuildingContext";
import BuildingForm from "./BuildingForm";

function BuildingsPanel() {
  const { buildings, loading, getBuildings, deleteBuilding } = useBuildings();
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getBuildings();
  }, []);

  const handleEdit = (building) => {
    setSelectedBuilding(building);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
      await deleteBuilding(id);
    }
  };

  if (loading) return <div>Loading buildings...</div>;

  return (
    <div className="buildings-panel">
      <h2>Buildings Management</h2>
      <button
        onClick={() => {
          setSelectedBuilding(null);
          setShowForm(true);
        }}
      >
        Add New Building
      </button>

      {showForm && (
        <BuildingForm
          building={selectedBuilding}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="buildings-list">
        {buildings.map((building) => (
          <div key={building._id} className="building-card">
            <h3>{building.buildingName}</h3>
            <p>Floors: {building.floors?.length || 0}</p>
            <div className="building-actions">
              <button onClick={() => handleEdit(building)}>Edit</button>
              <button onClick={() => handleDelete(building._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuildingsPanel;
