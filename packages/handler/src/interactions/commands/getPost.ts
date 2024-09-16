import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    SlashCommandBuilder,
    bold,
    codeBlock,
    formatEmoji,
    inlineCode,
} from "@discordjs/builders";
import { ButtonStyle } from "@discordjs/core";
import prisma from "database";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import type { Command } from "../../services/commands.js";
import { getCommandOption } from "../../utility/interactionUtils.js";

export const interaction: Command = {
    data: new SlashCommandBuilder()
        .setName("get-post")
        .setDescription("Grab a post that you can review.")
        .addStringOption((option) => option.setName("id").setDescription("The ID of the post").setRequired(true)),
    async execute(interaction): Promise<void> {
        const getOption = getCommandOption("id", ApplicationCommandOptionType.String, interaction.options) || "";
        const getQuery = await (await prisma).post.findUnique({
            include: { paste: true },
            where: { id: getOption },
        });

        if (!getQuery) return await interaction.reply({ content: "Invalid Post Found", ephemeral: true });

        const likeButton = new ButtonBuilder().setCustomId("like_post").setLabel("Like").setStyle(ButtonStyle.Success);
        const dislikeButton = new ButtonBuilder()
            .setCustomId("dislike_post")
            .setLabel("Dislike")
            .setStyle(ButtonStyle.Danger);

        const embed = new EmbedBuilder()
            .setDescription(`
                ${formatEmoji("1283395868648673331")} ${bold(inlineCode(getQuery.title))}
                ${formatEmoji("1283395921366880266")} ${bold(inlineCode("description"))}
                ${codeBlock(getQuery.language, getQuery.description)}
                ${formatEmoji("1283395929444978740")} ${bold(inlineCode("Code"))}
                ${codeBlock(getQuery.language, getQuery.paste[0]?.content || "")}
                ${
                    getQuery.paste[1]?.content_type === "ERROR"
                        ? `${formatEmoji("1283395936550260818")} ${bold(inlineCode("Error"))}
                ${codeBlock(getQuery.language, getQuery.paste[1].content)}`
                        : ""
                }
                ${formatEmoji("1283395907382939730")} ${bold(inlineCode("likes"))}: ${getQuery.likes} ~ ${formatEmoji("1283395887397343263")} ${bold(inlineCode("dislikes"))}: ${getQuery.dislikes}
                `)
            .setColor(0x2f3136)
            .setFooter({
                text: `• View the comments at https://snipstash.com/post/${getQuery.id}`,
            });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(likeButton, dislikeButton);

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
