import { createContext, useContext, useState, useEffect } from "react";
import {
  getReservationsRequest,
  getMyReservationsRequest,
  getReservationRequest,
  createReservationRequest,
  updateReservationStatusRequest,
  markAttendanceRequest,
  cancelReservationRequest,
} from "../api/reservations.js";

const ReservationContext = createContext();

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context)
    throw new Error(
      "useReservations must be used within a ReservationProvider"
    );
  return context;
};

export function ReservationProvider({ children }) {
  const [reservations, setReservations] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getReservations = async () => {
    try {
      setLoading(true);
      const res = await getReservationsRequest();
      setReservations(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrors(error.response.data);
    }
  };

  const getMyReservations = async () => {
    try {
      setLoading(true);
      const res = await getMyReservationsRequest();
      setMyReservations(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrors(error.response.data);
    }
  };

  const getReservation = async (id) => {
    try {
      const res = await getReservationRequest(id);
      return res.data;
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const getRoomReservations = async (roomId, date) => {
    try {
      const res = await getRoomReservationsRequest(roomId, date);
      return res.data;
    } catch (error) {
      setErrors(error.response.data);
      return [];
    }
  };

  const createReservation = async (reservation) => {
    try {
      const res = await createReservationRequest(reservation);
      await getMyReservations();
      return res.data;
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const updateReservationStatus = async (
    id,
    status,
    assignComputer = false
  ) => {
    try {
      await updateReservationStatusRequest(id, status, assignComputer);
      await getReservations();
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const markAttendance = async (id, attended) => {
    try {
      await markAttendanceRequest(id, attended);
      await getReservations();
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const cancelReservation = async (id) => {
    try {
      await cancelReservationRequest(id);
      await getMyReservations();
    } catch (error) {
      setErrors(error.response.data);
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
    <ReservationContext.Provider
      value={{
        reservations,
        myReservations,
        loading,
        getReservations,
        getMyReservations,
        getReservation,
        getRoomReservations,
        createReservation,
        updateReservationStatus,
        markAttendance,
        cancelReservation,
        errors,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}
