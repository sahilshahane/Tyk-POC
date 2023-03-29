import mongoose from "mongoose";

export const dbConnect = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) throw new Error("Please add MONGO_URI in your .env file");

  await mongoose.connect(MONGO_URI);
};
