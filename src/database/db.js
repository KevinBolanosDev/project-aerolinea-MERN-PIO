import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI_LOCAL);
    console.log(">>> DB is connected");
  } catch (error) {
    console.log("Something went wrong!");
    console.log(error);
  }
};