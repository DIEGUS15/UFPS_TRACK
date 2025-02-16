import Room from "../models/room.model.js";

//Get all rooms
export const getRooms = async (req, res) => {
  const rooms = await Room.find({
    user: req.user.id,
  }).populate("user");
  res.json(rooms);
};

//Get a room by ID
export const getRoom = async (req, res) => {
  const room = await Room.findById(req.params.id).populate("user");
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
};

//Create room
export const createRoom = async (req, res) => {
  const { roomName, roomDescription, roomUbication, roomType } = req.body;

  console.log(req.user);

  const newRoom = new Room({
    roomName,
    roomDescription,
    roomUbication,
    roomType,
    user: req.user.id,
  });
  const savedRoom = await newRoom.save();
  res.json(savedRoom);
};

//Delete room
export const deleteRoom = async (req, res) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });
  return res.sendStatus(204);
};

//Update room
export const updateRoom = async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
};
