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
    hasComputer: {
      type: Boolean,
      default: true,
    },
    computerDetails: {
      computerName: String,
      computerSpecs: String,
      isAvailable: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Seat", seatSchema);
