import prisma from "database";
import { addToPost, interactedWithPost } from "database";
import type { Button } from "../../services/commands.js";

export const interaction: Button = {
    custom_id: "dislike_post",
    async execute(interaction): Promise<void> {
        const db = await prisma;
        const footerText = interaction.embed_data?.footer?.text;
        const truncateID = footerText ? footerText.split("/").pop() : null;

        if (!truncateID) {
            await interaction.reply({
                content: "Unable to dislike the post. Post ID is missing.",
                ephemeral: true,
            });
            return;
        }

        const alreadyDisliked = await interactedWithPost(truncateID, interaction.member_id);

        if (!alreadyDisliked) {
            await db.post.update({
                data: {
                    dislikes: {
                        increment: 1,
                    },
                },
                where: { id: truncateID },
            });

            await addToPost(truncateID, interaction.member_id, "DISLIKE");

            return await interaction.reply({
                content: "You have disliked the post",
                ephemeral: true,
            });
        }

        await interaction.reply({
            content: "You have already interacted with this post",
            ephemeral: true,
        });
    },
};
