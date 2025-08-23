import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { postTable } from "@/db/schema/post.ts";
import { userTable } from "@/db/schema/auth.ts";
import { commentsTable } from "@/db/schema/comments.ts";


export const postUpvotesTable = pgTable("post_upvotes",{
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true
  }).defaultNow().notNull(),
});

const postUpvotesRelations = relations(postUpvotesTable, ({ one }) => ({
  post: one(postTable, {
    fields: [postUpvotesTable.postId],
    references: [postTable.id],
    relationName: "postUpvotes"
  }),
  user: one(userTable, {
    fields: [postUpvotesTable.userId],
    references: [userTable.id],
    relationName: "user"
  }),
}))

export const commentUpvotesTable = pgTable("comment_upvotes",{
  id: serial("id").primaryKey(),
  commentId: integer("comment_id").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true
  }).defaultNow().notNull(),
});

const commentUpvotesRelations = relations(commentUpvotesTable, ({ one }) => ({
  comment: one(commentsTable, {
    fields: [commentUpvotesTable.commentId],
    references: [commentsTable.id],
    relationName: "commentUpvotes"
  }),
  user: one(userTable, {
    fields: [commentUpvotesTable.userId],
    references: [userTable.id],
    relationName: "user"
  }),
}))
