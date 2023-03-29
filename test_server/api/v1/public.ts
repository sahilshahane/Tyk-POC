import express from "express";
import { APIError } from "@/libs/APIError";
import { TSignupReqBody, TSigninReqBody } from "@/types/api/v1/public";
import { genPassHash, isUserPassValid, signJWT } from "@/libs/auth";
import { User } from "@/database/schema/User";
import {
  DBError,
  getPasswordHashByEmail,
  getPostByPublicURL,
} from "@/database/utils";
import { Document, MongoServerError, ObjectId } from "mongodb";
import mongoose, { ClientSession } from "mongoose";
import { logger } from "@/libs/logger";

export const route = express();

route.post("/signup", async (req, res, next) => {
  try {
    const reqBody = req.body as TSignupReqBody;

    if (!reqBody || !reqBody.email || !reqBody.password || !reqBody.name)
      throw new APIError({
        message: "Provide valid email, password & name",
        code: 403,
      });

    logger.debug(reqBody);

    const { password, email, name } = reqBody;

    const passHash = genPassHash(password);

    await User.validate({
      passHash,
      email,
      name,
    });

    let session: ClientSession;

    const userid = new ObjectId();
    logger.debug(`userid = ${userid}`);

    await User.startSession()
      .then((_session) => {
        session = _session;

        return session.withTransaction(() => {
          return User.create(
            [
              {
                _id: userid,
                email,
                name,
                passHash,
              },
            ],
            {
              session,
            }
          );
        });
      })
      .then(() => session.endSession());

    const jwtToken = signJWT({
      user: {
        userid: userid.toString(),
      },
    });

    res.setHeader("Authorization", `Bearer ${jwtToken}`);
    res.json({
      message: "Signup successfull!",
    });
  } catch (error) {
    if (
      error instanceof MongoServerError &&
      error.code === DBError.DUPLICATE_KEY
    ) {
      error = new APIError({
        message: "Email already exists",
        code: 409,
      });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      let messages = [];
      for (const field in error.errors) {
        messages.push(error.errors[field]);
      }

      error = new APIError({
        message: messages.join(", "),
        code: 400,
      });
    }

    next(error);
  }
});

route.post("/login", async (req, res, next) => {
  try {
    const reqBody = req.body as TSigninReqBody;

    if (!reqBody || !reqBody.email || !reqBody.password)
      throw new APIError({
        message: "Provide username & password",
        code: 403,
      });

    const { password, email } = reqBody;

    const user = await getPasswordHashByEmail(email);

    if (!user)
      throw new APIError({
        message: "User does not exist",
        code: 404,
      });

    const isValid = isUserPassValid(password, user.passHash);

    if (!isValid)
      throw new APIError({
        message: "Password is invalid",
        code: 401,
      });

    const { id: userid } = user;

    const jwtToken = signJWT({
      user: {
        userid,
      },
    });

    res.setHeader("Authorization", `Bearer ${jwtToken}`);
    res.json({
      message: "Signin successfull!",
    });
  } catch (error) {
    next(error);
  }
});

route.get("/post/:postURL", async (req, res, next) => {
  try {
    const postURL = req.params.postURL;

    if (!postURL)
      throw new APIError({
        message: "Provide a valid post's url",
        code: 403,
      });

    const postDetails = await getPostByPublicURL(postURL);

    if (!postDetails)
      throw new APIError({
        message: "Post not found",
        code: 404,
      });

    res.json({
      title: postDetails.title,
      content: postDetails.content,
      // @ts-expect-error
      author: postDetails.author.name,
    });
  } catch (error) {
    next(error);
  }
});
