import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function BuildingCard({ building, onEdit, onDelete }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="building-card">
      <h3>{building.buildingName}</h3>
      <p>{building.floors?.length || 0} floors</p>

      <div className="building-actions">
        <Link to={`/buildings/${building._id}`} className="view-button">
          View Details
        </Link>

        {isAdmin && (
          <>
            <button onClick={() => onEdit(building)} className="edit-button">
              Edit
            </button>
            <button
              onClick={() => onDelete(building._id)}
              className="delete-button"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BuildingCard;
