// import axios from "./axios.js";

// export const createSeatRequest = (seat) => axios.post("/seats", seat);
// export const updateSeatRequest = (id, seat) => axios.put(`/seats/${id}`, seat);
// export const deleteSeatRequest = (id) => axios.delete(`/seats/${id}`);
// export const getSeatsByRoomRequest = (roomId) =>
//   axios.get(`/seats/room/${roomId}`);
import axios from "./axios.js";

export const getSeatsRequest = () => axios.get("/seats");
export const getSeatsByRoomRequest = (roomId) =>
  axios.get(`/seats/room/${roomId}`);
export const getSeatRequest = (id) => axios.get(`/seats/${id}`);
export const createSeatRequest = (seat) => axios.post("/seats", seat);
export const updateSeatRequest = (id, seat) => axios.put(`/seats/${id}`, seat);
export const deleteSeatRequest = (id) => axios.delete(`/seats/${id}`);
export const updateComputerAvailabilityRequest = (id, isAvailable) =>
  axios.patch(`/seats/${id}/computer-availability`, { isAvailable });
