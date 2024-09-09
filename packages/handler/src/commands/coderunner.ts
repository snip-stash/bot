import { SlashCommandBuilder, inlineCode } from "@discordjs/builders";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { type Command, getCommandOption } from "../services/commands.js";

// TODO: Change the choices and check to see if the language is valid

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("code-runner")
        .setDescription("Run code in a variety of languages")
        .addStringOption((option) =>
            option
                .setName("language")
                .setDescription("The language to run the code in")
                .setRequired(true)
                .addChoices(
                    { name: "JavaScript", value: ".js" },
                    { name: "TypeScript", value: ".ts" },
                    { name: "Python", value: ".py" },
                    { name: "C", value: ".c" },
                    { name: "C++", value: ".cpp" },
                    { name: "Java", value: ".java" },
                    { name: "Rust", value: ".rs" },
                    { name: "C#", value: ".cs" },
                    { name: "Zig", value: ".zig" },
                    { name: "Lua", value: ".lua" },
                    { name: "NASM", value: ".nasm" },
                    { name: "NASM64", value: ".nasm64" },
                ),
        )
        .addStringOption((option) => option.setName("code").setDescription("The code to run").setRequired(true)),
    async execute(interaction, api): Promise<void> {
        const languageOption = getCommandOption(
            "language",
            ApplicationCommandOptionType.String,
            interaction.data.options,
        );
        const codeOption = getCommandOption("code", ApplicationCommandOptionType.String, interaction.data.options);

        if (!languageOption)
            return await api.interactions.reply(interaction.id, interaction.token, { content: "Invalid Language" });

        if (!codeOption)
            return await api.interactions.reply(interaction.id, interaction.token, { content: "Invalid Code" });

        await api.interactions.reply(interaction.id, interaction.token, {
            content: `File Format: ${inlineCode(languageOption)}\nCode: ${inlineCode(codeOption)}`,
        });
    },
};
