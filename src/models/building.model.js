import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema(
  {
    buildingName: {
      type: String,
      required: true,
    },
    floors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Floor",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Building", buildingSchema);
