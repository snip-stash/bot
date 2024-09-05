import { PrismaClient } from "@prisma/client";
import { Logger } from "log";

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
        logger.info(`Query: ${e.query}`, "Prisma");
    });

    prisma.$on("info", (e: any) => {
        logger.info(`Info: ${e.message}`, "Prisma");
    });

    prisma.$on("warn", (e: any) => {
        logger.warn(`Warn: ${e.message}`, "Prisma");
    });

    prisma.$on("error", (e: any) => {
        logger.error(`Error: ${e.message}`, "Prisma");
    });

    prisma.$connect();

    return prisma;
}
