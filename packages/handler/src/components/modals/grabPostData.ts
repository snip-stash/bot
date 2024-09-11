import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    bold,
    codeBlock,
    formatEmoji,
    inlineCode,
} from "@discordjs/builders";
import { ButtonStyle } from "@discordjs/core";
import type { Modal } from "../../services/commands.js";

export const component: Modal = {
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
            .setColor(0x2f3136);

        const createButton = new ButtonBuilder()
            .setCustomId("create_post")
            .setLabel("Create")
            .setStyle(ButtonStyle.Success);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(createButton);

        await interaction.reply({
            content: bold("Are the following details correct?"),
            embeds: [embed],
            components: [row],
            ephemeral: true,
        });
    },
};
