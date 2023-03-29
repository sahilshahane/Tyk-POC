import { Schema, SchemaTypes, model } from "mongoose";
import { UserSchema } from "./User";
UserSchema;
export const BlogPostSchema = new Schema({
  title: {
    required: true,
    type: SchemaTypes.String,
  },
  content: {
    required: true,
    type: SchemaTypes.String,
  },
  author: {
    required: true,
    ref: "user",
    type: SchemaTypes.ObjectId,
  },
  publicURL: {
    required: true,
    unique: true,
    type: SchemaTypes.String,
  },
});

export const BlogPost = model("blogpost", BlogPostSchema);
