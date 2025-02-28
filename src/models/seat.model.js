import mongoose from "mongoose";

const seatSchema = mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Seat", seatChema);
