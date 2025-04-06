import Building from "../models/building.model.js";
import Floor from "../models/floor.model.js";

// Get all buildings
export const getBuildings = async (req, res) => {
  try {
    const buildings = await Building.find().populate({
      path: "floors",
      populate: {
        path: "rooms",
      },
    });
    res.json(buildings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get building by ID
export const getBuilding = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id).populate({
      path: "floors",
      populate: {
        path: "rooms",
      },
    });
    if (!building)
      return res.status(404).json({ message: "Building not found" });
    res.json(building);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create building
export const createBuilding = async (req, res) => {
  try {
    const { buildingName } = req.body;
    const newBuilding = new Building({
      buildingName,
    });
    const savedBuilding = await newBuilding.save();
    res.status(201).json(savedBuilding);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update building
export const updateBuilding = async (req, res) => {
  try {
    const { buildingName } = req.body;
    const building = await Building.findByIdAndUpdate(
      req.params.id,
      { buildingName },
      { new: true }
    );
    if (!building)
      return res.status(404).json({ message: "Building not found" });
    res.json(building);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete building
export const deleteBuilding = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building)
      return res.status(404).json({ message: "Building not found" });

    // Eliminar todos los pisos asociados al edificio
    await Floor.deleteMany({ building: building._id });

    // Eliminar el edificio
    await Building.findByIdAndDelete(req.params.id);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
