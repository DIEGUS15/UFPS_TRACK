// seat.controller.js
import Seat from "../models/seat.model.js";
import Room from "../models/room.model.js";

// Get all seats
export const getSeats = async (req, res) => {
  try {
    const seats = await Seat.find().populate("room");
    res.json(seats);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get seats by room
export const getSeatsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const seats = await Seat.find({ room: roomId }).sort({ number: 1 });
    res.json(seats);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get seat by ID
export const getSeat = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id).populate("room");
    if (!seat) return res.status(404).json({ message: "Seat not found" });
    res.json(seat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create seat
export const createSeat = async (req, res) => {
  try {
    const { number, roomId, hasComputer, computerDetails } = req.body;

    // Verificar si la sala existe
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Verificar si ya existe un asiento con ese número en la misma sala
    const existingSeat = await Seat.findOne({
      number,
      room: roomId,
    });
    if (existingSeat)
      return res
        .status(400)
        .json({ message: "Seat number already exists in this room" });

    const newSeat = new Seat({
      number,
      room: roomId,
      hasComputer: hasComputer || true,
      computerDetails: computerDetails || {
        computerName: `PC-${room.roomName}-${number}`,
        computerSpecs: "Standard",
        isAvailable: true,
      },
    });
    const savedSeat = await newSeat.save();

    // Actualizar la sala para incluir el nuevo asiento
    room.seats.push(savedSeat._id);
    await room.save();

    res.status(201).json(savedSeat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update seat
export const updateSeat = async (req, res) => {
  try {
    const { number, hasComputer, computerDetails } = req.body;

    const updatedData = {};
    if (number !== undefined) updatedData.number = number;
    if (hasComputer !== undefined) updatedData.hasComputer = hasComputer;
    if (computerDetails) updatedData.computerDetails = computerDetails;

    const seat = await Seat.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    if (!seat) return res.status(404).json({ message: "Seat not found" });
    res.json(seat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete seat
export const deleteSeat = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) return res.status(404).json({ message: "Seat not found" });

    // Eliminar el asiento
    await Seat.findByIdAndDelete(req.params.id);

    // Actualizar la sala para quitar la referencia al asiento
    await Room.findByIdAndUpdate(seat.room, { $pull: { seats: seat._id } });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update computer availability
export const updateComputerAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const seat = await Seat.findById(req.params.id);
    if (!seat) return res.status(404).json({ message: "Seat not found" });

    seat.computerDetails.isAvailable = isAvailable;
    const updatedSeat = await seat.save();

    res.json(updatedSeat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
