import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
    },
    roomDescription: {
      type: String,
      required: true,
    },
    floor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Floor",
      required: true,
    },
    roomType: {
      type: String,
      required: true,
      enum: ["classroom", "auditorium", "teacher's room"],
    },
    seats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Room", roomSchema);
