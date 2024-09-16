import { EmbedBuilder, bold, codeBlock, formatEmoji, inlineCode } from "@discordjs/builders";
import { createPost } from "database";
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

        const prismaPost = await createPost(interaction, code, error, title, description, language);

        const embed = new EmbedBuilder()
            .setDescription(`
                ${formatEmoji("1283395868648673331")} ${bold(inlineCode(title))}
                ${formatEmoji("1283395921366880266")} ${bold(inlineCode("description"))}
                ${codeBlock(language, description)}
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
            .setFooter({ text: `ID: ${prismaPost.id}` });
        await interaction.reply({
            content: bold("You have successfully made a post!"),
            embeds: [embed],
            ephemeral: true,
        });
    },
};
