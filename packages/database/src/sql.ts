import { env } from "core";
import { Logger } from "log";
import pg from "pg";

const { Pool } = pg;
const logger = new Logger();

export async function connectSQL() {
    const pool = env.POSTGRES_URL
        ? new Pool({ connectionString: env.POSTGRES_URL, ssl: { rejectUnauthorized: false } })
        : new Pool({
              user: env.POSTGRES_USERNAME,
              host: env.POSTGRES_HOST,
              database: env.POSTGRES_DATABASE,
              password: env.POSTGRES_PASSWORD,
              port: env.POSTGRES_PORT,
              ssl: {
                  rejectUnauthorized: false,
                  // SSL error if you enable this. We will have to create our own CA and sign it.
              },
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

    //await onCreate(pool);

    return pool;
}

/*
async function onCreate(pool: pg.Pool) {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS bot.tbl_user (
                discord_id BIGINT PRIMARY KEY,
                premium BOOLEAN NOT NULL,
                posts INT NOT NULL,
                runs_left SMALLINT NOT NULLs
            )
        `);
    } catch (err: any) {
        logger.error("Error creating table", "PostgreSQL", err);
    } finally {
        client.release();
    }
}   */
