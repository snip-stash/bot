import { EmbedBuilder, SlashCommandBuilder, bold, formatEmoji, inlineCode } from "@discordjs/builders";
import { ApplicationCommandOptionType } from "@discordjs/core";
import { type Command, FileType, load } from "../../services/commands.js";
import { getCommandOption } from "../../utility/interactionUtils.js";

export const interaction: Command = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("View a list of commands from the bot")
        .addStringOption((option) =>
            option
                .setName("command")
                .setDescription("The command you want to get more information about")
                .setRequired(false),
        ),
    async execute(interaction): Promise<void> {
        const commandName =
            getCommandOption("command", ApplicationCommandOptionType.String, interaction.options) || null;
        const commands = await load(FileType.Commands);
        const maxLength = Math.max(...Array.from(commands.values()).map((command) => command.data.name.length)) + 2;

        if (commandName) {
            const command = commands.get(commandName);
            if (!command)
                return await interaction.reply({ content: "Could not find registered command", ephemeral: true });

            const embed = new EmbedBuilder().setColor(0x2f3136).setDescription(`
                ${formatEmoji("1283395921366880266")} ${bold(inlineCode(command.data.name))}\n
                ${formatEmoji("1283395929444978740")} ${bold(inlineCode("description"))}
                ${command.data.description}\n
                ${formatEmoji("1283395879176503376")} ${bold(inlineCode("options"))}
                ${command.data.options?.map((option) => `${bold(inlineCode(option.toJSON().name.padEnd(maxLength)))} ${option.toJSON().description}`).join("\n") || bold("No options available")}
                `);

            return await interaction.reply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setColor(0x2f3136)
            .setDescription(
                `${formatEmoji("1283395921366880266")}  ${bold(inlineCode("commands"))}\n\n${Array.from(
                    commands.values(),
                )
                    .map((command) => {
                        const paddedName = command.data.name.padEnd(maxLength);
                        return `${inlineCode(paddedName)} ${command.data.description}`;
                    })
                    .join("\n")}`,
            )
            .setFooter({ text: "• Use /help <command> to get more information about a specific command •" });

        await interaction.reply({ embeds: [embed] });
    },
};
