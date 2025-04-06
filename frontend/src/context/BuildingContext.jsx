import { createContext, useContext, useState, useEffect } from "react";
import {
  getBuildingsRequest,
  getBuildingRequest,
  createBuildingRequest,
  updateBuildingRequest,
  deleteBuildingRequest,
  createFloorRequest,
  updateFloorRequest,
  createRoomRequest,
  updateRoomRequest,
} from "../api/buildings.js";
import {
  createSeatRequest,
  updateSeatRequest,
  deleteSeatRequest,
} from "../api/seats.js";

const BuildingContext = createContext();

export const useBuildings = () => {
  const context = useContext(BuildingContext);
  if (!context)
    throw new Error("useBuildings must be used within a BuildingProvider");
  return context;
};

export function BuildingProvider({ children }) {
  const [buildings, setBuildings] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para actualizar el estado local después de modificar un edificio/piso/sala
  const updateLocalState = (updatedItem, type) => {
    setBuildings((prevBuildings) => {
      if (type === "building") {
        return prevBuildings.map((b) =>
          b._id === updatedItem._id ? updatedItem : b
        );
      }

      if (type === "floor") {
        return prevBuildings.map((building) => {
          if (building.floors.some((f) => f._id === updatedItem._id)) {
            return {
              ...building,
              floors: building.floors.map((f) =>
                f._id === updatedItem._id ? updatedItem : f
              ),
            };
          }
          return building;
        });
      }

      if (type === "room") {
        return prevBuildings.map((building) => {
          let updated = false;
          const updatedFloors = building.floors.map((floor) => {
            if (floor.rooms.some((r) => r._id === updatedItem._id)) {
              updated = true;
              return {
                ...floor,
                rooms: floor.rooms.map((r) =>
                  r._id === updatedItem._id ? updatedItem : r
                ),
              };
            }
            return floor;
          });

          return updated ? { ...building, floors: updatedFloors } : building;
        });
      }

      return prevBuildings;
    });
  };

  const getBuildings = async () => {
    try {
      setLoading(true);
      const res = await getBuildingsRequest();
      setBuildings(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrors(error.response?.data || [error.message]);
    }
  };

  const getBuilding = async (id) => {
    try {
      const res = await getBuildingRequest(id);
      return res.data;
    } catch (error) {
      setErrors(error.response?.data || [error.message]);
    }
  };

  const createBuilding = async (building) => {
    try {
      const res = await createBuildingRequest(building);
      await getBuildings(); // Refrescar la lista
      return res.data;
    } catch (error) {
      setErrors(error.response?.data || [error.message]);
      throw error;
    }
  };

  const updateBuilding = async (id, building) => {
    try {
      const res = await updateBuildingRequest(id, building);
      updateLocalState(res.data, "building");
      return res.data;
    } catch (error) {
      setErrors(error.response?.data || [error.message]);
      throw error;
    }
  };

  const deleteBuilding = async (id) => {
    try {
      await deleteBuildingRequest(id);
      await getBuildings(); // Refrescar la lista
    } catch (error) {
      setErrors(error.response?.data || [error.message]);
      throw error;
    }
  };

  const createFloor = async (floorData) => {
    try {
      const res = await createFloorRequest(floorData);
      await getBuildings(); // Refrescar la lista completa
      return res.data;
    } catch (error) {
      setErrors(error.response?.data || [error.message]);
      throw error;
    }
  };

  const updateFloor = async (id, floorData) => {
    try {
      const res = await updateFloorRequest(id, floorData);
      updateLocalState(res.data, "floor");
      return res.data;
    } catch (error) {
      setErrors(error.response?.data || [error.message]);
      throw error;
    }
  };

  const createRoom = async (roomData) => {
    try {
      const res = await createRoomRequest(roomData);
      await getBuildings(); // Refrescar la lista completa
      return res.data;
    } catch (error) {
      setErrors(error.response?.data || [error.message]);
      throw error;
    }
  };

  const updateRoom = async (id, roomData) => {
    try {
      const res = await updateRoomRequest(id, roomData);
      updateLocalState(res.data, "room");
      return res.data;
    } catch (error) {
      setErrors(error.response?.data || [error.message]);
      throw error;
    }
  };

  const createSeat = async (seatData) => {
    try {
      const res = await createSeatRequest(seatData);
      await getBuildings(); // Refrescar la lista completa
      return res.data;
    } catch (error) {
      setErrors(error.response?.data || [error.message]);
      throw error;
    }
  };

  const updateSeat = async (id, seatData) => {
    try {
      const res = await updateSeatRequest(id, seatData);
      updateLocalState(res.data, "seat");
      return res.data;
    } catch (error) {
      setErrors(error.response?.data || [error.message]);
      throw error;
    }
  };

  const deleteSeat = async (id) => {
    try {
      await deleteSeatRequest(id);
      await getBuildings(); // Refrescar la lista
    } catch (error) {
      setErrors(error.response?.data || [error.message]);
      throw error;
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <BuildingContext.Provider
      value={{
        buildings,
        loading,
        errors,
        getBuildings,
        getBuilding,
        createBuilding,
        updateBuilding,
        deleteBuilding,
        createFloor,
        updateFloor,
        createRoom,
        updateRoom,
        createSeat,
        updateSeat,
        deleteSeat,
      }}
    >
      {children}
    </BuildingContext.Provider>
  );
}
