import { TJWTPayload } from "@/types/api/v1/private/auth";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";

export const genPassHash = (password: string) => {
  /**
   *  automatically generates hash with salting
   * For more info: https://www.npmjs.com/package/bcrypt
   */

  return hashSync(password, 10);
};

export const isUserPassValid = (password: string, passHash: string) => {
  return compareSync(password, passHash);
};

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ALGORITHM = "HS256";

if (!JWT_SECRET) throw new Error("Please add JWT_SECRET in your .env file");

export const signJWT = (payload: TJWTPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: "10d",
  });
};

export const decodeJWT = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    }) as TJWTPayload;
  } catch (error) {
    return null;
  }
};
