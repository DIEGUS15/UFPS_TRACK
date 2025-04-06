import axios from "./axios.js";

export const getFloorsRequest = () => axios.get("/floors");
export const getFloorRequest = (id) => axios.get(`/floors/${id}`);
export const createFloorRequest = (floor) => axios.post("/floors", floor);
export const updateFloorRequest = (id, floor) =>
  axios.put(`/floors/${id}`, floor);
export const deleteFloorRequest = (id) => axios.delete(`/floors/${id}`);
