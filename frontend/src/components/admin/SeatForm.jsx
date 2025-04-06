import { useState } from "react";
import { useBuildings } from "../../context/BuildingContext";

// Opción 1: Componente de flecha con cuerpo completo
const SeatForm = ({ seat, roomId, onClose }) => {
  const { createSeat, updateSeat } = useBuildings();
  const [formData, setFormData] = useState({
    number: seat?.number || "",
    hasComputer: seat?.hasComputer ?? true,
    computerDetails: {
      computerName: seat?.computerDetails?.computerName || "",
      computerSpecs: seat?.computerDetails?.computerSpecs || "Standard",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("computerDetails.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        computerDetails: {
          ...formData.computerDetails,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const seatData = {
        number: formData.number,
        roomId,
        hasComputer: formData.hasComputer,
        computerDetails: formData.hasComputer ? formData.computerDetails : null,
      };

      if (seat) {
        await updateSeat(seat._id, seatData);
      } else {
        await createSeat(seatData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving seat:", error);
    }
  };

  return (
    <div className="seat-form-modal">
      <div className="modal-content">
        <h3>{seat ? "Edit Seat" : "Create Seat"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Seat Number</label>
            <input
              type="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="hasComputer"
                checked={formData.hasComputer}
                onChange={handleChange}
              />
              Has Computer
            </label>
          </div>

          {formData.hasComputer && (
            <>
              <div className="form-group">
                <label>Computer Name</label>
                <input
                  type="text"
                  name="computerDetails.computerName"
                  value={formData.computerDetails.computerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Computer Specs</label>
                <input
                  type="text"
                  name="computerDetails.computerSpecs"
                  value={formData.computerDetails.computerSpecs}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
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
};

export default SeatForm;
