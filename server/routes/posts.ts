import { Hono } from "hono";
import type { Context } from "@/context.ts";
import { loggedIn } from "@/middleware/loggedIn.ts";
import { zValidator } from "@hono/zod-validator";
import { createPostSchema, type SuccessResponse } from "@/shared/types.ts";
import { db } from "@/adapter.ts";
import { postTable } from "@/db/schema/post.ts";


export const postRouter = new Hono<Context>().post("/", loggedIn, zValidator("form", createPostSchema), async  (c) => {
  const { title, url, content } = c.req.valid("form");
  const user = c.get("user")!;
  const [post] = await db.insert(postTable).values({
    title,
    content,
    url,
    userId: user.id
  }).returning({id: postTable.id});

  return c.json<SuccessResponse<{ postId: number}>>({
    success: true,
    message: "Post Created",
    data: { postId: post.id}
  },201)
})
