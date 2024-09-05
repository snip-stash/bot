import { SlashCommandBuilder } from "@discordjs/builders";
import { connectSQL } from "database";
import type { Command } from "../services/commands.js";

const pool = await connectSQL();

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("getcode")
        .setDescription("Grab the first result in snippet_code from a table"),
    async execute(interaction, api): Promise<void> {
        const result = await pool.query(`SELECT snippet_code::text as code FROM bot.tbl_snippets LIMIT 1`).catch(() => {
            return { rows: [] }; // This is a bad practice and should actually be handled properly
            // Considering this is just for testing purposes, it's fine
        });

        const table = result.rows[0]?.code?.toString() || "Invalid table name";
        await api.interactions.reply(interaction.id, interaction.token, { content: table });
    },
};
