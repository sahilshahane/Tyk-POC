import { APIError } from "@/libs/APIError";
import { decodeJWT } from "@/libs/auth";
import { NextFunction, Request, Response } from "express";

const TOKEN_REGEX = /Bearer (?<token>.*)/;

const NOT_AUTHORIZED_ERROR = new APIError({
  message: "You are not authorized to access this route",
  code: 401,
});

export const AuthenticateHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // extract token
    const auth = req.header("Authorization");

    if (!auth) throw NOT_AUTHORIZED_ERROR;

    const regexRes = TOKEN_REGEX.exec(auth);

    if (!regexRes) throw NOT_AUTHORIZED_ERROR;

    // @ts-expect-error
    const jwtToken = regexRes?.groups["token"] as string;

    const decodedJWT = decodeJWT(jwtToken);

    if (!decodedJWT) throw NOT_AUTHORIZED_ERROR;

    // @ts-expect-error
    req.user = decodedJWT["user"];

    next();
  } catch (error) {
    next(error);
  }
};
