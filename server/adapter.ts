
import { drizzle } from "drizzle-orm/postgres-js";

import posgtres from "postgres";

import { z } from "zod";

const EvnSchema = z.object({
    DATABASE_URL: z.url(),
});

const processEnv = EvnSchema.parse(process.env);

const queryClient = posgtres(processEnv.DATABASE_URL);
const db = drizzle(queryClient);
const result = await db.execute("select 1");
console.log(result)