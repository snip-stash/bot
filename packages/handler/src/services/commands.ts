import { readdir } from "node:fs/promises";
import { URL } from "node:url";
import type { SlashCommandBuilder } from "@discordjs/builders";
import type { API, APIInteraction } from "@discordjs/core";
import { REST } from "@discordjs/rest";
import { env } from "core";
import { Routes } from "discord-api-types/v10";
import { Logger } from "log";

export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: APIInteraction, api: API) => void;
}

const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
const logger = new Logger();

export async function loadCommands(): Promise<Map<string, Command>> {
    logger.info("Started loading application (/) commands.", "Commands");

    const commands = new Map<string, Command>();
    const allFiles = await readdir(new URL("../commands/", import.meta.url));

    if (!allFiles) {
        logger.error("Failed to find application (/) commands", "Commands");
        throw new Error("Failed to find application (/) commands");
    }

    const jsFiles = allFiles.filter((file) => file.endsWith(".js"));

    for (const file of jsFiles) {
        try {
            const command = (await import(`../commands/${file}`)).command;
            commands.set(command.data.name, command);
        } catch (error: any) {
            logger.error(`Failed to load application (/) command: ${file}`, "Commands", error);
        }
    }

    logger.info("Finished loading application (/) commands.", "Commands");

    return commands;
}

export async function deployCommands(commands: Map<string, Command>) {
    logger.info("Started deploying application (/) commands.", "Commands");

    try {
        await rest.put(Routes.applicationCommands(env.DISCORD_APPLICATION_ID), {
            body: Array.from(commands.values()).map((command) => command.data.toJSON()),
        });

        logger.info("Successfully deployed global application (/) commands.", "Commands");

        if (env.DISCORD_TEST_GUILD_ID) {
            await rest.put(Routes.applicationGuildCommands(env.DISCORD_APPLICATION_ID, env.DISCORD_TEST_GUILD_ID), {
                body: Array.from(commands.values()).map((command) => {
                    command.data.setDescription(`GUILD VERSION - ${command.data.description}`);
                    return command.data.toJSON();
                }),
            });

            logger.info("Successfully deployed guild application (/) commands.", "Commands");
        }
    } catch (error: any) {
        logger.error("Failed to deploy global application (/) commands.", "Commands", error);
    }
}
