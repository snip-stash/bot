import type { Button } from "../services/commands.js";

export const button: Button = {
    data: { name: "like_post" },
    async execute(interaction, api): Promise<void> {
        await api.interactions.editReply(interaction.id, interaction.token, {
            content: `Button ID: ${interaction.id}\nDisliked Post!`,
        });
    },
};
