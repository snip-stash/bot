import { connectPrisma } from "./sql.js";
import { createPost } from "./utility/createPost.js";

export { createPost };
const prisma = connectPrisma();
export default prisma;
