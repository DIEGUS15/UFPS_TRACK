// reservation.controller.js
import Reservation from "../models/reservation.model.js";
import Seat from "../models/seat.model.js";
import User from "../models/user.model.js";
import Room from "../models/room.model.js";

// Get all reservations
export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user")
      .populate("seat")
      .populate("room")
      .populate("approvedBy");
    res.json(reservations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get reservations by user (for students)
export const getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await Reservation.find({ user: userId })
      .populate("seat")
      .populate("room")
      .populate("approvedBy");
    res.json(reservations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get reservations for a specific room (for watchmen)
export const getRoomReservations = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { date } = req.query; // Opcional: filtrar por fecha

    let query = { room: roomId };
    if (date) {
      // Crear un rango para el día completo
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      query.reservationDate = { $gte: startDate, $lte: endDate };
    }

    const reservations = await Reservation.find(query)
      .populate("user")
      .populate("seat")
      .populate("approvedBy");

    res.json(reservations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get reservation by ID
export const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("user")
      .populate("seat")
      .populate("room")
      .populate("approvedBy");

    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    res.json(reservation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create reservation (for students)
export const createReservation = async (req, res) => {
  try {
    const { roomId, seatId, reservationDate, timeSlot } = req.body;
    const userId = req.user.id;

    // Verificar si la sala existe
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Verificar si el asiento existe y pertenece a la sala
    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ message: "Seat not found" });
    if (seat.room.toString() !== roomId) {
      return res
        .status(400)
        .json({ message: "Seat does not belong to the specified room" });
    }

    // Verificar si el asiento ya está reservado para esa fecha y horario
    const existingReservation = await Reservation.findOne({
      seat: seatId,
      reservationDate: new Date(reservationDate),
      "timeSlot.startTime": timeSlot.startTime,
      "timeSlot.endTime": timeSlot.endTime,
      status: { $in: ["pending", "approved"] },
    });

    if (existingReservation) {
      return res
        .status(400)
        .json({ message: "Seat already reserved for this time slot" });
    }

    // Crear la reserva
    const newReservation = new Reservation({
      user: userId,
      seat: seatId,
      room: roomId,
      reservationDate: new Date(reservationDate),
      timeSlot,
      status: "pending",
    });

    const savedReservation = await newReservation.save();

    // Populate the saved reservation with related data
    const populatedReservation = await Reservation.findById(
      savedReservation._id
    )
      .populate("user")
      .populate("seat")
      .populate("room");

    res.status(201).json(populatedReservation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update reservation status (for watchmen and admin)
export const updateReservationStatus = async (req, res) => {
  try {
    const { status, assignComputer } = req.body;
    const watchmanId = req.user.id;

    // Verificar que el estado sea válido
    if (!["pending", "approved", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    // Actualizar estado y, si corresponde, marcar como asignado
    reservation.status = status;

    if (status === "approved") {
      reservation.approvedBy = watchmanId;

      // Si se solicita asignar un computador
      if (assignComputer) {
        reservation.assignedComputer = true;

        // Actualizar el estado del computador en el asiento
        const seat = await Seat.findById(reservation.seat);
        if (seat && seat.hasComputer) {
          seat.computerDetails.isAvailable = false;
          await seat.save();
        }
      }
    }

    const updatedReservation = await reservation.save();

    // Populate the updated reservation with related data
    const populatedReservation = await Reservation.findById(
      updatedReservation._id
    )
      .populate("user")
      .populate("seat")
      .populate("room")
      .populate("approvedBy");

    res.json(populatedReservation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Mark attendance (for watchmen)
export const markAttendance = async (req, res) => {
  try {
    const { attended } = req.body;

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    reservation.attendance = attended;

    // Si la reserva está marcada como completada
    if (attended) {
      reservation.status = "completed";
    }

    const updatedReservation = await reservation.save();

    // Populate the updated reservation
    const populatedReservation = await Reservation.findById(
      updatedReservation._id
    )
      .populate("user")
      .populate("seat")
      .populate("room")
      .populate("approvedBy");

    res.json(populatedReservation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Cancel reservation (for students, their own reservations only)
export const cancelReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    // Verificar que la reserva pertenezca al usuario
    if (reservation.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this reservation" });
    }

    // Verificar que la reserva no esté ya completada
    if (reservation.status === "completed") {
      return res
        .status(400)
        .json({ message: "Cannot cancel a completed reservation" });
    }

    // Liberar el computador si fue asignado
    if (reservation.assignedComputer) {
      const seat = await Seat.findById(reservation.seat);
      if (seat) {
        seat.computerDetails.isAvailable = true;
        await seat.save();
      }
    }

    // Eliminar la reserva
    await Reservation.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
