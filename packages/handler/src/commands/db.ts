import { SlashCommandBuilder } from "@discordjs/builders";
import { connectSQL } from "database";
import type { Command } from "../services/commands.js";

const pool = await connectSQL();

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Grab a result from the database")
        .addStringOption((option) =>
            option.setName("table").setDescription("The table to grab from").setRequired(true),
        ),

    async execute(interaction, api): Promise<void> {
        console.log(interaction.data.options?.[0]?.name);
        const table = (
            await pool.query("SELECT anilist_name::text as name FROM tblanilist SET LIMIT 1")
        ).rows[0].name.toString();
        await api.interactions.reply(interaction.id, interaction.token, { content: table });
    },
};
