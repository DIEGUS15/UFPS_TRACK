import { useState } from "react";
import { useBuildings } from "../../context/BuildingContext";

function BuildingForm({ building, onClose }) {
  const { createBuilding, updateBuilding } = useBuildings();
  const [formData, setFormData] = useState({
    buildingName: building?.buildingName || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (building) {
      await updateBuilding(building._id, formData);
    } else {
      await createBuilding(formData);
    }
    onClose();
  };

  return (
    <div className="building-form-modal">
      <div className="modal-content">
        <h3>{building ? "Edit Building" : "Create Building"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Building Name</label>
            <input
              type="text"
              name="buildingName"
              value={formData.buildingName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BuildingForm;
