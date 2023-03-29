import mongoose from "mongoose";
import { User } from "@/database/schema/User";
import { BlogPost } from "./schema/BlogPost";

export enum DBError {
  DUPLICATE_KEY = 11000,
}

export const dbConnect = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) throw new Error("Please add MONGO_URI in your .env file");

  await mongoose.connect(MONGO_URI);
};

export const getPasswordHashByEmail = async (email: string) => {
  const res = await User.findOne(
    {
      email,
    },
    {
      passHash: true,
      id: true,
    }
  );

  return res;
};

export const getPostByPublicURL = async (publicURL: string) => {
  const res = await BlogPost.findOne(
    {
      publicURL,
    },
    {
      author: true,
      title: true,
      content: true,
    }
  ).populate("author", "name");

  return res;
};
