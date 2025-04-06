import axios from "./axios.js";

export const getReservationsRequest = () => axios.get("/reservations");
export const getMyReservationsRequest = () => axios.get("/my-reservations");
export const getReservationRequest = (id) => axios.get(`/reservations/${id}`);
export const createReservationRequest = (reservation) =>
  axios.post("/reservations", reservation);
export const updateReservationStatusRequest = (id, status, assignComputer) =>
  axios.patch(`/reservations/${id}/status`, { status, assignComputer });
export const markAttendanceRequest = (id, attended) =>
  axios.patch(`/reservations/${id}/attendance`, { attended });
export const cancelReservationRequest = (id) =>
  axios.delete(`/reservations/${id}/cancel`);
