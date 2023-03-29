import { BlogPost } from "@/database/schema/BlogPost";
import { AuthenticateHandler } from "@/middleware/AuthenticateHandler";
import { TCreatePostReqBody } from "@/types/api/v1/private";
import { APIError } from "@/libs/APIError";
import express from "express";
import { DBError } from "@/database/utils";
import { createPublicURL } from "@/libs";
import { MongoServerError } from "mongodb";

export const route = express();

route.use(AuthenticateHandler);

route.post("/create-post", async (req, res, next) => {
  try {
    const reqBody = req.body as TCreatePostReqBody;

    if (!reqBody || !reqBody.title || !reqBody.content)
      throw new APIError({
        message: "Provide valid title & content",
        code: 403,
      });

    // @ts-expect-error
    const { userid } = req.user;

    const { title, content } = reqBody;

    const publicURL = createPublicURL();

    const post = new BlogPost({
      title,
      content,
      author: userid,
      publicURL,
    });

    const { id: postid } = await post.save();

    res.json({
      message: `Post created! visit /post/${publicURL} to view the post`,
    });
  } catch (error) {
    if (
      error instanceof MongoServerError &&
      error.code === DBError.DUPLICATE_KEY
    ) {
      error = new APIError({
        message:
          "Title with a same name already exists, please modify the title",
        code: 409,
      });
    }

    next(error);
  }
});
