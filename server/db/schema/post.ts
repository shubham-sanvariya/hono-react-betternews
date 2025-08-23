import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userTable } from "@/db/schema/auth.ts";


export const postTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  url: text("url"),
  content: text("content"),
  points: integer("points").default(0).notNull(),
  commentCount: integer("comment_count").default(0).notNull(),
  createdAt: timestamp("created_at",{
    withTimezone: true
  }).defaultNow().notNull(),
});

export const postsRelations = relations(postTable, ({one}) => ({
  author: one(userTable, {
    fields: [postTable.userId],
    references: [userTable.id],
    relationName: "author",
  })
}))
