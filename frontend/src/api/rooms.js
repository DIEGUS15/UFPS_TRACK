import axios from "./axios.js";

export const getRoomsRequest = () => axios.get("/rooms");
export const getRoomRequest = (id) => axios.get(`/rooms/${id}`);
export const createRoomRequest = (room) => axios.post("/rooms", room);
export const updateRoomRequest = (id, room) => axios.put(`/rooms/${id}`, room);
export const deleteRoomRequest = (id) => axios.delete(`/rooms/${id}`);
export const getRoomReservationsRequest = (roomId, date) =>
  axios.get(`/reservations/room/${roomId}`, { params: { date } });
