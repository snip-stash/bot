import {
    ActionRowBuilder,
    type ModalActionRowComponentBuilder,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
} from "@discordjs/builders";
import { TextInputStyle } from "@discordjs/core";
import type { Command } from "../../services/commands.js";

export const interaction: Command = {
    data: new SlashCommandBuilder()
        .setName("create-post")
        .setDescription("Create a post that you want to share/need help with"),
    async execute(interaction): Promise<void> {
        const modal = new ModalBuilder().setCustomId("create-post-modal").setTitle("create Post");

        const titleInput = new TextInputBuilder()
            .setCustomId("create-post-title")
            .setPlaceholder("JavaScript NameError, any help?")
            .setLabel("Post Title")
            .setMinLength(3)
            .setMaxLength(32)
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const descriptionInput = new TextInputBuilder()
            .setCustomId("create-post-description")
            .setPlaceholder("I am getting a NameError in my JavaScript code, can someone help me?")
            .setMinLength(3)
            .setMaxLength(500)
            .setLabel("Description")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const languageInput = new TextInputBuilder()
            .setCustomId("create-post-language")
            .setPlaceholder("js, py, java, etc.")
            .setMinLength(2)
            .setMaxLength(12)
            .setLabel("Language")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const codeInput = new TextInputBuilder()
            .setCustomId("create-post-code")
            .setPlaceholder("console.log('Hello, World!')")
            .setMinLength(3)
            .setLabel("Code")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const errorInput = new TextInputBuilder()
            .setCustomId("create-post-error")
            .setPlaceholder("NameError: name 'foo' is not defined")
            .setMinLength(3)
            .setLabel("Error")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        const titleRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(titleInput);
        const descriptionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(descriptionInput);
        const languageRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(languageInput);
        const codeRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(codeInput);
        const errorRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(errorInput);

        modal.addComponents(titleRow, descriptionRow, languageRow, codeRow, errorRow);
        await interaction.deployModal(modal);
    },
};
