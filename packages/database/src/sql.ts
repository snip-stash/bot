import { env } from "core";
import { Logger } from "log";
import pg from "pg";
import { createSchemas } from "./sqlSetup.js";

const { Pool } = pg;
const logger = new Logger();

export async function connectSQL() {
    const pool = env.POSTGRES_URL
        ? new Pool({ connectionString: env.POSTGRES_URL, ssl: false })
        : new Pool({
              user: env.POSTGRES_USERNAME,
              host: env.POSTGRES_HOST,
              database: env.POSTGRES_DATABASE,
              password: env.POSTGRES_PASSWORD,
              port: env.POSTGRES_PORT,
              ssl: false,
          });

    pool.on("error", (err: any) => {
        logger.error("Unexpected error on idle client", "PostgreSQL", err);
    });

    pool.on("connect", () => {
        logger.infoSingle("Connected to pool", "PostgreSQL");
    });

    pool.on("acquire", () => {
        logger.infoSingle("Acquiring client from pool", "PostgreSQL");
    });

    pool.on("remove", () => {
        logger.infoSingle("Removing client from pool", "PostgreSQL");
    });

    pool.on("release", () => {
        logger.infoSingle("Releasing client back to pool", "PostgreSQL");
    });

    pool.connect();

    await createSchemas(pool);

    return pool;
}
