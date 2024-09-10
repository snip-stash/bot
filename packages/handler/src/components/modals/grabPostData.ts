import type { Modal } from "../../services/commands.js";

export const component: Modal = {
    custom_id: "create-post-modal",
    async execute(interaction): Promise<void> {
        const components = interaction.modalValues;

        await interaction.reply({
            content: `${components.map((component) => component.value).join(", ")}`,
            ephemeral: true,
        });
    },
};
