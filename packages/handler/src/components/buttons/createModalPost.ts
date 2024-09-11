import type { Button } from "../../services/commands.js";

export const component: Button = {
    custom_id: "create_post",
    async execute(interaction): Promise<void> {
        await interaction.reply({
            content: "You have successfully created a post!\nShare it with others to get help or help others!",
            ephemeral: true,
        });
    },
};
