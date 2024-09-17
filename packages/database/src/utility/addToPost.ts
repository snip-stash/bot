import type { PostInteraction } from "../../prisma/gen/client/index.js";
import prisma from "../index.js";

export async function addToPost(
    post_id: string,
    member_id: bigint,
    interactionType: "LIKE" | "DISLIKE",
): Promise<PostInteraction> {
    const db = await prisma;

    const addToPost = await db.postInteraction.create({
        data: {
            user_id: member_id,
            post_id: post_id,
            interaction: interactionType,
        },
    });

    return addToPost;
}
