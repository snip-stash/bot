import { SlashCommandBuilder } from "@discordjs/builders";
import prisma from "database";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import type { Command } from "../services/commands.js";
import { getCommandOption } from "../services/commands.js";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("testdb")
        .setDescription("Grab a result from prisma")
        .addStringOption((option) =>
            option.setName("language").setDescription("The language to grab from").setRequired(true),
        ),

    async execute(interaction, api): Promise<void> {
        const grabOption = getCommandOption("language", ApplicationCommandOptionType.String, interaction.data.options);

        if (!grabOption) return;

        const getCode = await (await prisma).snippet.findUnique({
            where: { snippet_id: 1, snippet_lang: grabOption },
        });

        const snippetCode = getCode?.snippet_code || "Invalid language";

        await api.interactions.reply(interaction.id, interaction.token, { content: snippetCode });
    },
};
