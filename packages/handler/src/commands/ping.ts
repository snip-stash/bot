import { SlashCommandBuilder } from "@discordjs/builders";
import type { Command } from "../services/commands.js";

export const command: Command = {
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    async execute(interaction, api): Promise<void> {
        await api.interactions.reply(interaction.id, interaction.token, { content: "Pong!" });
    },
};
