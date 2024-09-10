import { SlashCommandBuilder, inlineCode } from "@discordjs/builders";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { type Command, getCommandOption } from "../../services/commands.js";

const languages = Array.from([
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
]);

export const component: Command = {
    data: new SlashCommandBuilder()
        .setName("code-runner")
        .setDescription("Run code in a variety of languages")
        .addStringOption((option) =>
            option
                .setName("language")
                .setDescription("The language to run the code in")
                .setRequired(true)
                .addChoices(languages),
        )
        .addStringOption((option) => option.setName("code").setDescription("The code to run").setRequired(true)),
    async execute(interaction): Promise<void> {
        const languageOption = getCommandOption("language", ApplicationCommandOptionType.String, interaction.options);
        const codeOption = getCommandOption("code", ApplicationCommandOptionType.String, interaction.options);

        if (!languageOption || !languages.some((lang) => lang.value === languageOption))
            return await interaction.reply({ content: "Invalid Language", ephemeral: true });

        if (!codeOption) return await interaction.reply({ content: "Invalid Code", ephemeral: true });

        await interaction.reply({
            content: `File Format: ${inlineCode(languageOption)}\nCode: ${inlineCode(codeOption)}`,
        });
    },
};
