import prisma from "database";
import { addToPost, interactedWithPost } from "database";
import type { Button } from "../../services/commands.js";

export const interaction: Button = {
    custom_id: "like_post",
    async execute(interaction): Promise<void> {
        const db = await prisma;
        const footerText = interaction.embed_data?.footer?.text;
        const truncateID = footerText ? footerText.split("/").pop() : null;

        if (!truncateID) {
            await interaction.reply({
                content: "Unable to like the post. Post ID is missing.",
                ephemeral: true,
            });
            return;
        }

        const alreadyLiked = await interactedWithPost(truncateID, interaction.member_id);

        if (!alreadyLiked) {
            await db.post.update({
                data: {
                    likes: {
                        increment: 1,
                    },
                },
                where: { id: truncateID },
            });

            await addToPost(truncateID, interaction.member_id, "LIKE");

            return await interaction.reply({
                content: "You have liked the post",
                ephemeral: true,
            });
        }

        await interaction.reply({
            content: "You have already interacted with this post",
            ephemeral: true,
        });
    },
};
