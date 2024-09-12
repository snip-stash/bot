import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    SlashCommandBuilder,
    bold,
    codeBlock,
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
        .addNumberOption((option) => option.setName("id").setDescription("The ID of the post").setRequired(true)),
    async execute(interaction): Promise<void> {
        const getOption = getCommandOption("id", ApplicationCommandOptionType.Number, interaction.options) || -1;
        const getQuery = await (await prisma).post.findUnique({
            include: { PasteCode: true, PasteError: true },
            where: { id: getOption },
        });

        if (!getQuery) return await interaction.reply({ content: "Invalid Post Found", ephemeral: true });

        const likeButton = new ButtonBuilder().setCustomId("like_post").setLabel("Like").setStyle(ButtonStyle.Success);
        const dislikeButton = new ButtonBuilder()
            .setCustomId("dislike_post")
            .setLabel("Dislike")
            .setStyle(ButtonStyle.Danger);

        const embed = new EmbedBuilder()
            .setTitle(getQuery?.title)
            .setDescription(
                `   ${bold("Content")}
                    ${getQuery?.description}\n${codeBlock(getQuery?.PasteCode.lang, getQuery?.PasteCode.content)}
                    ${getQuery?.PasteError?.content ? `${bold("Error")}\n${codeBlock(getQuery?.PasteCode.lang, getQuery?.PasteError?.content)}` : ""}\n
                    ${bold("Likes")} : ${getQuery?.likes} ~ ${bold("Dislikes")} : ${getQuery?.dislike}
                `,
            )
            .setColor(0x2f3136)
            .setFooter({
                text: `• View the comments at https://snipstash.com/post/${getQuery?.id}`,
            });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(likeButton, dislikeButton);

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
