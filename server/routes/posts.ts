import { Hono } from "hono";
import { and, asc, countDistinct, desc, eq, sql } from "drizzle-orm";

import { db } from "@/adapter.ts";
import type { Context } from "@/context.ts";
import { userTable } from "@/db/schema/auth.ts";
import { postTable } from "@/db/schema/post.ts";
import { postUpvotesTable } from "@/db/schema/upvotes.ts";
import { loggedIn } from "@/middleware/loggedIn.ts";
import { zValidator } from "@hono/zod-validator";

import {
  createPostSchema,
  paginationSchema,
  type PaginatedResponse,
  type Post,
  type SuccessResponse,
} from "@/shared/types.ts";
import { getISOFormatDateQuery } from "@/lib/utils.ts";

export const postRouter = new Hono<Context>()
  .post("/", loggedIn, zValidator("form", createPostSchema), async (c) => {
    const { title, url, content } = c.req.valid("form");
    const user = c.get("user")!;
    const [post] = await db
      .insert(postTable)
      .values({
        title,
        content,
        url,
        userId: user.id,
      })
      .returning({ id: postTable.id });

    return c.json<SuccessResponse<{ postId: number }>>(
      {
        success: true,
        message: "Post Created",
        data: { postId: post.id },
      },
      201,
    );
  })
  .get("/", zValidator("query", paginationSchema), async (c) => {
    const { limit, page, sortBy, order, author, site } = c.req.valid("query");

    const user = c.get("user");
    const offset = (page - 1) * limit;
    const sortByColumn =
      sortBy === "points" ? postTable.points : postTable.createdAt;

    const sortOrder = order === "desc" ? desc(sortByColumn) : asc(sortByColumn);

    const [count] = await db
      .select({ count: countDistinct(postTable.id) })
      .from(postTable)
      .where(
        and(
          author ? eq(postTable.userId, author) : undefined,
          site ? eq(postTable.url, site) : undefined,
        ),
      );

    const postQuery = db
      .select({
        id: postTable.id,
        title: postTable.title,
        url: postTable.url,
        points: postTable.points,
        createdAt: getISOFormatDateQuery(postTable.createdAt),
        commentCount: postTable.commentCount,
        author: {
          username: userTable.username,
          id: userTable.id,
        },
        isUpvoted: user
          ? sql<boolean>`CASE WHEN
        ${postUpvotesTable.userId}
        IS
        NOT
        NULL
        THEN
        true
        ELSE
        false
        END`
          : sql<boolean>`false`,
      })
      .from(postTable)
      .leftJoin(userTable, eq(postTable.userId, userTable.id))
      .orderBy(sortOrder)
      .limit(limit)
      .offset(offset)
      .where(
        and(
          author ? eq(postTable.userId, author) : undefined,
          site ? eq(postTable.url, site) : undefined,
        ),
      );

    if (user) {
      postQuery.leftJoin(
        postUpvotesTable,
        and(
          eq(postUpvotesTable.postId, postTable.id),
          eq(postUpvotesTable.userId, user.id),
        ),
      );
    }

    const posts = await postQuery;

    return c.json<PaginatedResponse<Post[]>>({
      data: posts as Post[],
      success: true,
      message: "Posts fetched",
      pagination: {
        page: page,
        totalPages: Math.ceil(count.count / limit) as number
      },
    }, 200);
  });
