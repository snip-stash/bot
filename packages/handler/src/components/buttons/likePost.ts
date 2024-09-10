import type { Button } from "../../services/commands.js";

export const component: Button = {
    custom_id: "like_post",
    async execute(interaction): Promise<void> {
        await interaction.reply({
            content: `${interaction.member?.user.global_name} liked the post!`,
            ephemeral: true,
        });
    },
};
