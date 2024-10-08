import { ContentType, type Post } from "../../prisma/gen/client/default.js";
import prisma from "../index.js";

export async function createPost(
    interaction: any,
    code: string,
    error: string | null,
    title: string,
    description: string,
    language: string,
): Promise<Post> {
    const db = await prisma;

    const user = await db.user.upsert({
        create: {
            id: interaction.member_id,
            discord_id: interaction.member_id,
            username: interaction.member_name,
            premium: false,
            code_runs_left: 30,
        },
        update: {
            discord_id: interaction.member_id,
            username: interaction.member_name,
        },
        where: {
            id: interaction.member_id,
        },
    });

    const pasteContent = [];

    // I dont understand why it wont just accept this above
    pasteContent.push({
        content: code,
        content_type: ContentType.CODE,
    });

    if (error) {
        pasteContent.push({
            content: error,
            content_type: ContentType.ERROR,
        });
    }

    const post = await db.post.create({
        data: {
            paste: {
                create: pasteContent,
            },
            uploader_id: user.id,
            title: title,
            description: description,
            likes: 0,
            dislikes: 0,
            language: language,
        },
        include: { uploader: true, paste: true },
    });

    return post;
}
