import Room from "../models/room.model.js";
import Floor from "../models/floor.model.js";
import Seat from "../models/seat.model.js";

// Get all rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("floor")
      .populate({
        path: "seats",
        populate: {
          path: "seats",
        },
      });
    res.json(rooms);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a room by ID
export const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("floor")
      .populate("seats");
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create room
export const createRoom = async (req, res) => {
  try {
    const { roomName, roomDescription, roomType, floorId, seatsCount } =
      req.body;

    // Verificar si el piso existe
    const floor = await Floor.findById(floorId);
    if (!floor) return res.status(404).json({ message: "Floor not found" });

    const newRoom = new Room({
      roomName,
      roomDescription,
      roomType,
      floor: floorId,
    });

    // Guardar la sala primero para tener su ID
    const savedRoom = await newRoom.save();

    // Crear los asientos para la sala
    const seatsPromises = [];
    for (let i = 1; i <= seatsCount; i++) {
      const newSeat = new Seat({
        number: i,
        room: savedRoom._id,
        hasComputer: true,
        computerDetails: {
          computerName: `PC-${roomName}-${i}`,
          computerSpecs: "Standard",
          isAvailable: true,
        },
      });
      const savedSeat = await newSeat.save();
      seatsPromises.push(savedSeat._id);
    }

    // Actualizar la sala con los asientos creados
    savedRoom.seats = seatsPromises;
    await savedRoom.save();

    // Actualizar el piso para incluir la nueva sala
    floor.rooms.push(savedRoom._id);
    await floor.save();

    res.status(201).json(savedRoom);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete room
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Eliminar todos los asientos asociados a la sala
    await Seat.deleteMany({ room: room._id });

    // Eliminar la sala
    await Room.findByIdAndDelete(req.params.id);

    // Actualizar el piso para quitar la referencia a la sala
    await Floor.findByIdAndUpdate(room.floor, { $pull: { rooms: room._id } });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update room
export const updateRoom = async (req, res) => {
  try {
    const { roomName, roomDescription, roomType, floorId } = req.body;

    // Si se incluye un nuevo piso, verificar que exista
    if (floorId) {
      const floor = await Floor.findById(floorId);
      if (!floor) return res.status(404).json({ message: "Floor not found" });
    }

    const updatedData = {
      roomName,
      roomDescription,
      roomType,
    };

    if (floorId) updatedData.floor = floorId;

    const room = await Room.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    }).populate("seats");

    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
