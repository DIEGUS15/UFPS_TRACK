import mongoose from "mongoose";

const floorSchema = new mongoose.Schema(
  {
    numberFloor: {
      type: Number,
      required: true,
    },
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Floor", floorSchema);
