import { connectPrisma } from "./sql.js";
import { addToPost } from "./utility/addToPost.js";
import { createPost } from "./utility/createPost.js";
import { interactedWithPost } from "./utility/interactedWithPost.js";

export { createPost, interactedWithPost, addToPost };
const prisma = connectPrisma();
export default prisma;
