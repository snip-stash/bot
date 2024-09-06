import { SlashCommandBuilder } from "@discordjs/builders";
import prisma from "database";
import type { Command } from "../services/commands.js";

export const command: Command = {
    data: new SlashCommandBuilder().setName("getpost").setDescription("Grab the first post"),
    async execute(interaction, api): Promise<void> {
        const getQuery = await (await prisma).post.findFirst();
        const post = getQuery ? getQuery.post_content.toString() : "Invalid Post";

        await api.interactions.reply(interaction.id, interaction.token, { content: post });
    },
};
