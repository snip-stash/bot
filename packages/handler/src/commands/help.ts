import { EmbedBuilder, SlashCommandBuilder, bold, inlineCode } from "@discordjs/builders";
import { loadCommands } from "../services/commands.js";
import type { Command } from "../services/commands.js";

export const command: Command = {
    data: new SlashCommandBuilder().setName("help").setDescription("View a list of commands from the bot"),
    async execute(interaction, api): Promise<void> {
        const commands = await loadCommands();
        const maxLength = Math.max(...Array.from(commands.values()).map((command) => command.data.name.length)) + 2;
        const paddedHeader = "Commands".padStart((maxLength + "Commands".length) / 2).padEnd(maxLength);

        const embed = new EmbedBuilder()
            .setColor(0x2f3136)
            .setDescription(
                `${bold(inlineCode(paddedHeader))}\n\n${Array.from(commands.values())
                    .map((command) => {
                        const paddedName = command.data.name.padEnd(maxLength);
                        return `${inlineCode(paddedName)} ${command.data.description}`;
                    })
                    .join("\n")}`,
            )
            .setFooter({ text: "• Use /help <command> to get more information about a specific command •" });

        await api.interactions.reply(interaction.id, interaction.token, {
            embeds: [embed.toJSON()],
        });
    },
};
