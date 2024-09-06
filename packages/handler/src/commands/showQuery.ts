import { SlashCommandBuilder } from "@discordjs/builders";
import prisma from "database";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import type { Command } from "../services/commands.js";
import { getCommandOption } from "../services/commands.js";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("showquery")
        .setDescription("Grab a result from prisma")
        .addNumberOption((option) =>
            option
                .setName("language")
                .setDescription("The language of the snippet to grab")
                .setRequired(true)
                .addChoices({ name: "JavaScript", value: 1 }, { name: "Python", value: 2 }, { name: "Java", value: 3 }),
        ),

    async execute(interaction, api): Promise<void> {
        const idOption = getCommandOption("language", ApplicationCommandOptionType.Number, interaction.data.options);

        if (!idOption) return;

        const getCode = await (await prisma).snippet.findUnique({
            where: { snippet_id: idOption },
        });

        const snippetCode = getCode?.snippet_code || "Invalid language";
        await api.interactions.reply(interaction.id, interaction.token, { content: snippetCode });
    },
};
