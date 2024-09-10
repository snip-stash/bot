import {
    ActionRowBuilder,
    type ModalActionRowComponentBuilder,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
} from "@discordjs/builders";
import { TextInputStyle } from "@discordjs/core";
import type { Command } from "../../services/commands.js";

export const component: Command = {
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
            .setPlaceholder("Description")
            .setMinLength(3)
            .setMaxLength(500)
            .setLabel("Description")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const codeInput = new TextInputBuilder()
            .setCustomId("create-post-code")
            .setPlaceholder("Code")
            .setMinLength(3)
            .setLabel("Code")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const errorInput = new TextInputBuilder()
            .setCustomId("create-post-error")
            .setPlaceholder("Error")
            .setMinLength(3)
            .setLabel("Error")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(titleInput);
        const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(descriptionInput);
        const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(codeInput);
        const fourthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(errorInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);
        await interaction.deployModal(modal);
    },
};
