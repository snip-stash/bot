import { SlashCommandBuilder } from "@discordjs/builders";
import { connectPrisma } from "database";
import type { Command } from "../services/commands.js";

const prisma = connectPrisma();

export const command: Command = {
    data: new SlashCommandBuilder().setName("getPost").setDescription("Grab the first post"),
    async execute(interaction, api): Promise<void> {
        const getQuery = await (await prisma).post.findFirst();

        const post = getQuery ? JSON.stringify(getQuery) : "Invalid Post";

        await api.interactions.reply(interaction.id, interaction.token, { content: post });
    },
};
