import { useState } from "react";
import { useBuildings } from "../../context/BuildingContext";

function FloorForm({ floor, buildings, onClose }) {
  const { createFloor, updateFloor } = useBuildings();
  const [formData, setFormData] = useState({
    numberFloor: floor?.numberFloor || "",
    buildingId: floor?.building || buildings[0]?._id || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (floor) {
      await updateFloor(floor._id, {
        numberFloor: formData.numberFloor,
        buildingId: formData.buildingId,
      });
    } else {
      await createFloor({
        numberFloor: formData.numberFloor,
        buildingId: formData.buildingId,
      });
    }
    onClose();
  };

  return (
    <div className="floor-form-modal">
      <div className="modal-content">
        <h3>{floor ? "Edit Floor" : "Create Floor"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Floor Number</label>
            <input
              type="number"
              name="numberFloor"
              value={formData.numberFloor}
              onChange={handleChange}
              min="1"
              required
            />
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

export default FloorForm;
