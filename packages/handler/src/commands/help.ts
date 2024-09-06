import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { loadCommands } from "../services/commands.js";
import type { Command } from "../services/commands.js";

export const command: Command = {
    data: new SlashCommandBuilder().setName("help").setDescription("View a list of commands from the bot"),
    async execute(interaction, api): Promise<void> {
        const commands = await loadCommands();

        const embed = new EmbedBuilder().setColor(0x0099ff).setDescription(
            `**All Commands**\n\n${Array.from(commands.values())
                .map((command) => `**${command.data.name}** - ${command.data.description}`)
                .join("\n")}`,
        );

        await api.interactions.reply(interaction.id, interaction.token, {
            embeds: [embed.toJSON()],
        });
    },
};
