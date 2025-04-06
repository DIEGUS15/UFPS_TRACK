import axios from "./axios.js";

// Operaciones con edificios
export const getBuildingsRequest = () => axios.get("/buildings");
export const getBuildingRequest = (id) => axios.get(`/buildings/${id}`);
export const createBuildingRequest = (building) =>
  axios.post("/buildings", building);
export const updateBuildingRequest = (id, building) =>
  axios.put(`/buildings/${id}`, building);
export const deleteBuildingRequest = (id) => axios.delete(`/buildings/${id}`);

// Operaciones con pisos
export const createFloorRequest = (floor) => axios.post("/floors", floor);
export const updateFloorRequest = (id, floor) =>
  axios.put(`/floors/${id}`, floor);

// Operaciones con salas
export const createRoomRequest = (room) => axios.post("/rooms", room);
export const updateRoomRequest = (id, room) => axios.put(`/rooms/${id}`, room);
