import {PgColumn} from "drizzle-orm/pg-core";
import {sql, SQL} from "drizzle-orm";


export function getISOFormatDateQuery(dateTimeColumn: PgColumn) : SQL<string> {
    return sql<string>`to_char(${dateTimeColumn}, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`
}
