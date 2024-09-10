import { readdir } from "node:fs/promises";
import { URL } from "node:url";
import type { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "@discordjs/builders";
import {
    type API,
    type APIApplicationCommandInteractionDataBasicOption,
    type APIApplicationCommandInteractionDataOption,
    type APIApplicationCommandInteractionDataSubcommandOption,
    type APIChatInputApplicationCommandInteraction,
    type APIMessageComponentInteraction,
    ApplicationCommandOptionType,
    type Snowflake,
} from "@discordjs/core";
import { REST } from "@discordjs/rest";
import { env } from "core";
import { Routes } from "discord-api-types/v10";
import { Logger } from "log";

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: APIChatInputApplicationCommandInteraction, api: API) => void;
}

export interface Button {
    data: { name: string };
    execute: (interaction: APIMessageComponentInteraction, api: API) => void;
}

export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Subcommand,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): APIApplicationCommandInteractionDataBasicOption[] | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.SubcommandGroup,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): APIApplicationCommandInteractionDataSubcommandOption[] | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Number,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): number | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Mentionable,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): Snowflake | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Integer,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): number | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Attachment,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): Snowflake | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Role,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): Snowflake | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.User,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): Snowflake | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Channel,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): Snowflake | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Boolean,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): boolean | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.String,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): string | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): any | null {
    if (!options) return null;

    const option = options.find((option) => option.name === name);

    if (option?.type !== type) return null;

    if (
        option.type === ApplicationCommandOptionType.Subcommand ||
        option.type === ApplicationCommandOptionType.SubcommandGroup
    )
        return option.options;
    return option.value;
}

const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
const logger = new Logger();

export async function loadCommands(): Promise<Map<string, Command>> {
    logger.infoSingle("Started loading application (/) commands.", "Commands");

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

    logger.infoSingle("Finished loading application (/) commands.", "Commands");

    return commands;
}

export async function deployCommands(commands: Map<string, Command>) {
    logger.info("Started deploying application (/) commands.", "Commands", {
        commands: Array.from(commands.keys()),
        count: commands.size,
    });

    try {
        await rest.put(Routes.applicationCommands(env.DISCORD_APPLICATION_ID), {
            body: Array.from(commands.values()).map((command) => command.data.toJSON()),
        });

        logger.info("Successfully deployed global application (/) commands.", "Commands", {
            commands: Array.from(commands.keys()),
            count: commands.size,
        });

        if (env.DISCORD_TEST_GUILD_ID) {
            await rest.put(Routes.applicationGuildCommands(env.DISCORD_APPLICATION_ID, env.DISCORD_TEST_GUILD_ID), {
                body: Array.from(commands.values()).map((command) => {
                    command.data.setDescription(`GUILD VERSION - ${command.data.description}`);
                    return command.data.toJSON();
                }),
            });

            logger.info("Successfully deployed guild application (/) commands.", "Commands", {
                commands: Array.from(commands.keys()),
                count: commands.size,
            });
        }
    } catch (error: any) {
        logger.error("Failed to deploy global application (/) commands.", "Commands", error);
    }
}

export async function loadButtons(): Promise<Map<string, Button>> {
    logger.infoSingle("Started loading application (▶️ ) buttons.", "Buttons");

    const buttons = new Map<string, Button>();
    const allFiles = await readdir(new URL("../buttons/", import.meta.url));

    if (!allFiles) {
        logger.error("Failed to find application (▶️ ) buttons", "Buttons");
        throw new Error("Failed to find application (▶️ ) buttons");
    }

    const jsFiles = allFiles.filter((file) => file.endsWith(".js"));

    for (const file of jsFiles) {
        try {
            const button = (await import(`../buttons/${file}`)).button;
            buttons.set(button.data.name, button);
        } catch (error: any) {
            logger.error(`Failed to load application (▶️ ) button: ${file}`, "Buttons", error);
        }
    }

    logger.infoSingle("Finished loading application (▶️ ) buttons.", "Buttons");

    return buttons;
}
