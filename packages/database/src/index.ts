import { connectPrisma } from "./sql.js";
export { seedPrisma } from "./sqlSetup.js";

const prisma = connectPrisma();
export default prisma;
