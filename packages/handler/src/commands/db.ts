import { SlashCommandBuilder } from "@discordjs/builders";
import { connectSQL } from "database";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import type { Command } from "../services/commands.js";
import { getCommandOption } from "../services/commands.js";

const pool = await connectSQL();

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("testdb")
        .setDescription("Grab a result from the bot schema database")
        .addStringOption((option) =>
            option.setName("table").setDescription("The table to grab from").setRequired(true),
        ),

    async execute(interaction, api): Promise<void> {
        const grabOption = getCommandOption("table", ApplicationCommandOptionType.String, interaction.data.options);

        if (!grabOption) return;

        const result = await pool.query(`SELECT discord_id::text as id FROM bot.${grabOption} LIMIT 1`).catch(() => {
            return { rows: [] }; // This is a bad practice and should actually be handled properly
            // Considering this is just for testing purposes, it's fine
        });

        const table = result.rows[0]?.id?.toString() || "Invalid table name";
        await api.interactions.reply(interaction.id, interaction.token, { content: table });
    },
};
