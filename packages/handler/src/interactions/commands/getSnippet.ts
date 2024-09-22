import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import prisma from "database";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import type { Command } from "../../services/commands.js";
import { getCommandOption } from "../../utility/interactionUtils.js";

const db = await prisma;

export const interaction: Command = {
    data: new SlashCommandBuilder()
        .setName("get-snippet")
        .setDescription("View a snippet from the community")
        .addStringOption((option) => option.setName("id").setDescription("The ID of the Snippet").setRequired(true)),
    async execute(interaction): Promise<void> {
        const getOption = getCommandOption("id", ApplicationCommandOptionType.String, interaction.options) || "";
        const getQuery = await db.snippets.findUnique({
            include: { uploader: true },
            where: { id: getOption },
        });

        if (!getQuery) return await interaction.reply({ content: "Invalid Snippet Found", ephemeral: true });

        const embed = new EmbedBuilder().setDescription("IMAGE OF SNIPPET").setColor(0x2f3136);

        await interaction.reply({ embeds: [embed] });
    },
};
