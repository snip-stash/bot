import { connectPrisma } from "./sql.js";
export { seedPrisma } from "./sqlSeeding.js";

const prisma = connectPrisma();
export default prisma;
