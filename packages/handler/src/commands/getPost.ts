import { EmbedBuilder, SlashCommandBuilder, bold, codeBlock, inlineCode } from "@discordjs/builders";
import prisma from "database";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import type { Command } from "../services/commands.js";
import { getCommandOption } from "../services/commands.js";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("getpost")
        .setDescription("Grab a post from the database")
        .addNumberOption((option) =>
            option.setName("id").setDescription("The ID of the post you want to grab").setRequired(true),
        ),
    async execute(interaction, api): Promise<void> {
        const getOption = getCommandOption("id", ApplicationCommandOptionType.Number, interaction.data.options) || -1;
        const getQuery = await (await prisma).post.findUnique({
            include: { PasteCode: true, PasteError: true },
            where: { id: getOption },
        });

        if (!getQuery)
            return await api.interactions.reply(interaction.id, interaction.token, { content: "Invalid Post Found" });

        const keywords = getQuery?.keywords.map((keyword) => keyword).join(", ");
        const embed = new EmbedBuilder()
            .setDescription(
                `   ${bold(inlineCode(`${getQuery?.title}`))}\n
                    ${bold(inlineCode("content"))}\n
                    ${bold(getQuery?.description)}\n${codeBlock(getQuery?.PasteCode.lang, getQuery?.PasteCode.content)}
                    ${getQuery?.PasteError?.content ? codeBlock(getQuery?.PasteCode.lang, getQuery?.PasteError?.content) : ""}\n
                    ${bold(inlineCode("likes"))} ${getQuery?.likes} | ${bold(inlineCode("dislikes"))} ${getQuery?.dislike}\n
                    ${bold(inlineCode("keywords"))}\n${keywords}
                `,
            )
            .setColor(0x2f3136)
            .setFooter({
                text: `• ${getQuery?.date.getDay()}/${getQuery?.date.getMonth()}/${getQuery?.date.getFullYear()}`,
            });

        await api.interactions.reply(interaction.id, interaction.token, { embeds: [embed.toJSON()] });
    },
};
