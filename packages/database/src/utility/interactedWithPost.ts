import prisma from "../index.js";

export async function interactedWithPost(post_id: string, member_id: bigint): Promise<any> {
    const db = await prisma;

    const existsInPost = await db.postInteraction.findFirst({
        where: {
            post: {
                id: post_id,
                uploader_id: member_id,
            },
        },
    });

    return existsInPost;
}
