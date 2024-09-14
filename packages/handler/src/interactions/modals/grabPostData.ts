import { EmbedBuilder, bold, codeBlock, formatEmoji, inlineCode } from "@discordjs/builders";
import prisma from "database";
import type { Modal } from "../../services/commands.js";

export const interaction: Modal = {
    custom_id: "create-post-modal",
    async execute(interaction): Promise<void> {
        const title = interaction.getModalValue("create-post-title")?.value;
        const description = interaction.getModalValue("create-post-description")?.value;
        const language = interaction.getModalValue("create-post-language")?.value;
        const code = interaction.getModalValue("create-post-code")?.value;
        const error = interaction.getModalValue("create-post-error")?.value || null;

        if (!title || !description || !code || !language) {
            await interaction.reply({
                content: "Please fill out the required fields.",
                ephemeral: true,
            });
            return;
        }

        const createPost = await (await prisma).post.create({
            data: {
                uploader: {
                    create: {
                        discord_id: interaction.member_id,
                        username: interaction.member_name,
                        premium: false,
                        code_runs_left: 30,
                    },
                },
                paste: {
                    create: {
                        content: code,
                        content_type: "CODE",
                        uploader_id: interaction.member_id,
                    },
                },
                title: title,
                description: description,
            },
            include: { uploader: true, paste: true },
        });

        const embed = new EmbedBuilder()
            .setDescription(`
                ${formatEmoji("1283395868648673331")} ${bold(inlineCode(title))}
                ${formatEmoji("1283395921366880266")} ${bold(inlineCode("description"))}
                ${codeBlock(description)}
                ${formatEmoji("1283395929444978740")} ${bold(inlineCode("Code"))}
                ${codeBlock(language, code)}
                ${
                    error
                        ? `${formatEmoji("1283395936550260818")} ${bold(inlineCode("Error"))}
                ${codeBlock(language, error)}`
                        : ""
                }
                `)
            .setColor(0x2f3136)
            .setFooter({ text: `ID: ${createPost.id}` });
        await interaction.reply({
            content: bold("You have successfully made a post!"),
            embeds: [embed],
            ephemeral: true,
        });
    },
};
