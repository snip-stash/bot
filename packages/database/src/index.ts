import { connectPrisma } from "./sql.js";
export { seedPrisma, nanoid } from "./sqlSeeding.js";

const prisma = connectPrisma();
export default prisma;
