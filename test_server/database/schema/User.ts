import { Schema, SchemaTypes, model } from "mongoose";
import joi from "joi";
export const UserSchema = new Schema({
  email: {
    required: true,
    unique: true,
    type: SchemaTypes.String,
    validate: {
      validator: (v: string) => {
        return !joi.string().email().validate(v).error;
      },
      message: () => `Please provide a valid email`,
    },
  },
  name: {
    required: true,
    type: SchemaTypes.String,
    validate: {
      validator: (v: string) => {
        return !joi.string().min(3).max(50).validate(v).error;
      },
      message: () => `Name's length should be between 3 to 50`,
    },
  },
  passHash: {
    required: true,
    type: SchemaTypes.String,
  },
});

export const User = model("user", UserSchema);
