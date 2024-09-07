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
        const getQuery =
            (await (await prisma).post.findUnique({ include: { user: true }, where: { post_id: getOption } })) || null;

        if (!getQuery)
            return await api.interactions.reply(interaction.id, interaction.token, { content: "Invalid Post Found" });

        const postMadeBy = getQuery?.user.discord_name ?? "No User Found";
        const postDate = getQuery?.post_date ?? "No Date Found";
        const postHeader = getQuery?.post_header ?? "No Post Found";
        const postContentFull = getQuery?.post_content ?? "No Content Found";
        const postContentProblem = postContentFull.split("Code: ")[0]?.toString() || "No Problem Found";
        const postContentCode = postContentFull.split("Code: ")[1]?.toString() || "No Code Found";
        const postLikes = getQuery?.post_likes ?? 0;
        const postLang = getQuery?.post_lang ?? "js";
        const postDislikes = getQuery?.post_dislikes ?? 0;
        const postKeywords = (getQuery?.post_keywords ?? "No Keywords Found").split(" ");
        const formattedKeywords = postKeywords.map((keyword) => inlineCode(keyword)).join(", ");

        const embed = new EmbedBuilder()
            .setDescription(
                `   ${bold(inlineCode(`${postHeader} @ ${postMadeBy}`))}\n
                    ${bold(inlineCode("content"))}\n
                    ${bold(postContentProblem)}\n${codeBlock(postLang, postContentCode)}
                    ${bold(inlineCode("likes"))} ${postLikes} | ${bold(inlineCode("dislikes"))} ${postDislikes}\n
                    ${bold(inlineCode("keywords"))}\n${formattedKeywords}
                `,
            )
            .setColor(0x2f3136)
            .setFooter({
                text: `• ${postDate.getDay()}/${postDate.getMonth()}/${postDate.getFullYear()}`,
            });

        await api.interactions.reply(interaction.id, interaction.token, { embeds: [embed.toJSON()] });
    },
};
