
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { drizzle } from "drizzle-orm/postgres-js";

import posgtres from "postgres";

import { z } from "zod";
import { sessionTable, userRelations, userTable } from "./db/schema/auth";
import { postsRelations, postTable } from "./db/schema/post";
import { commentRelations, commentsTable } from "./db/schema/comments";
import { commentUpvotesRelations, commentUpvotesTable, postUpvotesRelations, postUpvotesTable } from "./db/schema/upvotes";

const EvnSchema = z.object({
    DATABASE_URL: z.url(),
});

const processEnv = EvnSchema.parse(process.env);

const queryClient = posgtres(processEnv.DATABASE_URL);

export const db = drizzle(queryClient,{
    schema: {
        user: userTable,
        session: sessionTable,
        posts: postTable,
        comments: commentsTable,
        postUpvotes: postUpvotesTable,
        commentUpvoted: commentUpvotesTable,
        postsRelations,
        commentUpvotesRelations,
        postUpvotesRelations,
        userRelations,
        commentRelations
    }
});

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);