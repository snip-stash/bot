import { Logger } from "log";
import { PrismaClient } from "../prisma/gen/client/default.js";

const logger = new Logger();

export async function connectPrisma() {
    const prisma = new PrismaClient({
        log: [
            {
                emit: "event",
                level: "query",
            },
            {
                emit: "event",
                level: "info",
            },
            {
                emit: "event",
                level: "warn",
            },
            {
                emit: "event",
                level: "error",
            },
        ],
    });

    prisma.$on("query", (e: any) => {
        logger.info("Query", "Prisma", e.message);
    });

    prisma.$on("info", (e: any) => {
        logger.info("Info", "Prisma", e.message);
    });

    prisma.$on("warn", (e: any) => {
        logger.warn("Warn", "Prisma", e.message);
    });

    prisma.$on("error", (e: any) => {
        logger.error("Error", "Prisma", e.message);
    });

    prisma.$connect();

    return prisma;
}
