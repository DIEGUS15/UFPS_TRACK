import Floor from "../models/floor.model.js";
import Building from "../models/building.model.js";
import Room from "../models/room.model.js";
import Seat from "../models/seat.model.js";

// Get all floors
export const getFloors = async (req, res) => {
  try {
    const floors = await Floor.find().populate("building").populate("rooms");
    res.json(floors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get floor by ID
export const getFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id)
      .populate("building")
      .populate({
        path: "rooms",
        populate: {
          path: "seats",
        },
      });
    if (!floor) return res.status(404).json({ message: "Floor not found" });
    res.json(floor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create floor
export const createFloor = async (req, res) => {
  try {
    const { numberFloor, buildingId } = req.body;

    // Verificar si el edificio existe
    const building = await Building.findById(buildingId);
    if (!building)
      return res.status(404).json({ message: "Building not found" });

    // Verificar si ya existe un piso con ese número en el mismo edificio
    const existingFloor = await Floor.findOne({
      numberFloor,
      building: buildingId,
    });
    if (existingFloor)
      return res
        .status(400)
        .json({ message: "Floor number already exists in this building" });

    const newFloor = new Floor({
      numberFloor,
      building: buildingId,
    });
    const savedFloor = await newFloor.save();

    // Actualizar el edificio para incluir el nuevo piso
    building.floors.push(savedFloor._id);
    await building.save();

    res.status(201).json(savedFloor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update floor
export const updateFloor = async (req, res) => {
  try {
    const { numberFloor, buildingId } = req.body;

    // Si se incluye un nuevo edificio, verificar que exista
    if (buildingId) {
      const building = await Building.findById(buildingId);
      if (!building)
        return res.status(404).json({ message: "Building not found" });
    }

    const updatedData = {};
    if (numberFloor !== undefined) updatedData.numberFloor = numberFloor;
    if (buildingId) updatedData.building = buildingId;

    const floor = await Floor.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    if (!floor) return res.status(404).json({ message: "Floor not found" });
    res.json(floor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete floor
export const deleteFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id);
    if (!floor) return res.status(404).json({ message: "Floor not found" });

    // Buscar todas las salas en este piso
    const rooms = await Room.find({ floor: floor._id });

    // Para cada sala, eliminar sus asientos asociados
    for (const room of rooms) {
      await Seat.deleteMany({ room: room._id });
    }

    // Eliminar todas las salas asociadas al piso
    await Room.deleteMany({ floor: floor._id });

    // Eliminar el piso
    await Floor.findByIdAndDelete(req.params.id);

    // Actualizar el edificio para quitar la referencia al piso
    await Building.findByIdAndUpdate(floor.building, {
      $pull: { floors: floor._id },
    });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
