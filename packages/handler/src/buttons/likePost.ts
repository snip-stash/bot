import { MessageFlags } from "@discordjs/core";
import type { Button } from "../services/commands.js";

export const button: Button = {
    data: { name: "like_post" },
    async execute(interaction, api): Promise<void> {
        await api.interactions.reply(interaction.id, interaction.token, {
            content: `${interaction.member?.user.global_name} liked the post!`,
            flags: MessageFlags.Ephemeral,
        });
    },
};
