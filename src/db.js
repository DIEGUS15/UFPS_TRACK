import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/UFPSTRACK");
    // await mongoose.connect("mongodb://localhost/UFPSTRACK");
    console.log(">>> DB is connected");
  } catch (error) {
    console.log(error);
  }
};
