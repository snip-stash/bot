import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandOptionType } from "@discordjs/core";
import prisma from "database";
import type { Command } from "../../services/commands.js";
import { getCommandOption } from "../../utility/interactionUtils.js";

const db = await prisma;

export const interaction: Command = {
    data: new SlashCommandBuilder()
        .setName("create-snippet")
        .setDescription("Create a snippet to share with the community")
        .addStringOption((option) =>
            option.setName("code").setDescription("The code you want to share").setRequired(true),
        )

        .addStringOption((option) =>
            option
                .setName("language")
                .setDescription("The language of the code")
                .setRequired(true)
                .addChoices([
                    { name: "JavaScript", value: "js" },
                    { name: "TypeScript", value: "ts" },
                    { name: "Python", value: "py" },
                    { name: "Java", value: "java" },
                    { name: "C#", value: "csharp" },
                    { name: "C++", value: "cpp" },
                    { name: "C", value: "c" },
                    { name: "SQL", value: "sql" },
                    { name: "Rust", value: "rs" },
                    { name: "Go", value: "go" },
                    { name: "Swift", value: "swift" },
                    { name: "Perl", value: "pl" },
                    { name: "Lua", value: "lua" },
                    { name: "Shell", value: "shell" },
                    { name: "Erlang", value: "erlang" },
                ]),
        )

        .addStringOption((option) =>
            option
                .setName("style")
                .setDescription("The style of the code")
                .setRequired(true)
                .addChoices([
                    { name: "MacOS", value: "macos" },
                    { name: "Linux", value: "linux" },
                    { name: "Windows", value: "windows" },
                ]),
        ),

    async execute(interaction): Promise<void> {
        const codeOption = getCommandOption("code", ApplicationCommandOptionType.String, interaction.options);
        const languageOption = getCommandOption("language", ApplicationCommandOptionType.String, interaction.options);
        const styleOption = getCommandOption("style", ApplicationCommandOptionType.String, interaction.options);

        if (!codeOption || !languageOption || !styleOption) {
            return await interaction.reply({ content: "Missing required options", ephemeral: true });
        }

        const createSnippet = await db.snippets.create({
            data: {
                snippet_image: Buffer.from("IMAGE"),
                uploader_id: interaction.member_id,
            },
        });

        await interaction.reply({ content: `Snippet created: ${createSnippet.id}`, ephemeral: true });
    },
};
