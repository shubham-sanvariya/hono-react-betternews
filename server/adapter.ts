
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { drizzle } from "drizzle-orm/postgres-js";

import posgtres from "postgres";

import { z } from "zod";
import { sessionTable, userTable } from "./db/schema/auth";

const EvnSchema = z.object({
    DATABASE_URL: z.url(),
});

const processEnv = EvnSchema.parse(process.env);

const queryClient = posgtres(processEnv.DATABASE_URL);

export const db = drizzle(queryClient,{
    schema: {
        user: userTable,
        session: sessionTable
    }
});

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);