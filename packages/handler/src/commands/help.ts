import { SlashCommandBuilder } from "@discordjs/builders";
import type { Command } from "../services/commands.js";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("View a list of commands from the bot")
        .addStringOption((option) =>
            option.setName("command").setDescription("Specific command to view").setRequired(false),
        ),

    async execute(interaction, api): Promise<void> {
        await api.interactions.reply(interaction.id, interaction.token, {
            content: "Totally awesome help menu",
        });
    },
};
