// import { useEffect, useState } from "react";
// import { useBuildings } from "../../context/BuildingContext";
// import SeatForm from "./SeatForm";

// function SeatsPanel() {
//   const { buildings, loading, getBuildings } = useBuildings();
//   const [selectedSeat, setSelectedSeat] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [selectedRoom, setSelectedRoom] = useState("");

//   useEffect(() => {
//     getBuildings();
//   }, []);

//   const handleEdit = (seat) => {
//     setSelectedSeat(seat);
//     setShowForm(true);
//   };

//   const getRoomSeats = () => {
//     if (!selectedRoom) return [];

//     for (const building of buildings) {
//       for (const floor of building.floors || []) {
//         const room = floor.rooms?.find((r) => r._id === selectedRoom);
//         if (room) return room.seats || [];
//       }
//     }
//     return [];
//   };

//   if (loading) return <div>Loading seats data...</div>;

//   return (
//     <div className="seats-panel">
//       <h2>Seats Management</h2>

//       <div className="filter-section">
//         <div className="filter-group">
//           <label>Select Room: </label>
//           <select
//             value={selectedRoom}
//             onChange={(e) => setSelectedRoom(e.target.value)}
//           >
//             <option value="">Select a room</option>
//             {buildings.flatMap((building) =>
//               building.floors?.flatMap((floor) =>
//                 floor.rooms?.map((room) => (
//                   <option key={room._id} value={room._id}>
//                     {building.buildingName} - Floor {floor.numberFloor} -{" "}
//                     {room.roomName}
//                   </option>
//                 ))
//               )
//             )}
//           </select>
//         </div>
//       </div>

//       {selectedRoom && (
//         <>
//           <button
//             onClick={() => {
//               setSelectedSeat(null);
//               setShowForm(true);
//             }}
//             className="add-button"
//           >
//             Add New Seat
//           </button>

//           {showForm && (
//             <SeatForm
//               seat={selectedSeat}
//               roomId={selectedRoom}
//               onClose={() => setShowForm(false)}
//             />
//           )}

//           <div className="seats-list">
//             {getRoomSeats().map((seat) => (
//               <div key={seat._id} className="seat-card">
//                 <h3>Seat {seat.number}</h3>
//                 <p>Computer: {seat.hasComputer ? "Yes" : "No"}</p>
//                 {seat.hasComputer && (
//                   <p>
//                     Status:{" "}
//                     {seat.computerDetails?.isAvailable ? "Available" : "In Use"}
//                   </p>
//                 )}
//                 <div className="seat-actions">
//                   <button
//                     onClick={() => handleEdit(seat)}
//                     className="edit-button"
//                   >
//                     Edit
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default SeatsPanel;
import { useState } from "react";
import { useBuildings } from "../../context/BuildingContext";

function SeatForm({ seat, roomId, onClose, onSuccess }) {
  const { createSeat, updateSeat } = useBuildings();
  const [formData, setFormData] = useState({
    number: seat?.number || "",
    hasComputer: seat?.hasComputer ?? true,
    computerDetails: {
      computerName: seat?.computerDetails?.computerName || "",
      computerSpecs: seat?.computerDetails?.computerSpecs || "Standard",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
    setIsSubmitting(true);
    setError(null);

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
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to save seat");
      console.error("Error saving seat:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="seat-form-modal">
      <div className="modal-content">
        <h3>{seat ? "Edit Seat" : "Create Seat"}</h3>

        {error && <div className="error-message">{error}</div>}

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
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="hasComputer"
                checked={formData.hasComputer}
                onChange={handleChange}
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SeatForm;
