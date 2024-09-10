import {
    type APIChatInputApplicationCommandInteraction,
    type APIMessageComponentInteraction,
    ApplicationCommandType,
    Client,
    GatewayDispatchEvents,
    InteractionType,
} from "@discordjs/core";

import { REST } from "@discordjs/rest";
import { getRedis } from "core";
import { env } from "core/dist/env.js";
import { seedPrisma } from "database";
import { ComponentType } from "discord-api-types/v10";
import { Logger } from "log";
import { Gateway } from "./gateway.js";
import { loadButtons, loadCommands } from "./services/commands.js";

const logger = new Logger();
export const commands = await loadCommands();
export const buttons = await loadButtons();
const redis = await getRedis();
const rest = new REST().setToken(env.DISCORD_TOKEN);
const gateway = new Gateway({ redis, env });
await gateway.connect();
const client = new Client({ rest, gateway });

function isChatInput(interaction: any): interaction is APIChatInputApplicationCommandInteraction {
    return (
        interaction.type === InteractionType.ApplicationCommand &&
        interaction.data.type === ApplicationCommandType.ChatInput
    );
}

function isButtonType(interaction: any): interaction is APIMessageComponentInteraction {
    return (
        interaction.type === InteractionType.MessageComponent &&
        interaction.data.component_type === ComponentType.Button &&
        interaction.data.custom_id !== undefined
    );
}

client.on(GatewayDispatchEvents.MessageCreate, async ({ data: message }) => {
    logger.infoSingle(`Received message: ${message.content}`, "Handler");
});

client.on(GatewayDispatchEvents.Ready, () => {
    logger.infoSingle("Ready", "Handler");
});

client.on(GatewayDispatchEvents.Resumed, () => {
    logger.infoSingle("Resumed", "Handler");
});

client.on(GatewayDispatchEvents.InteractionCreate, async ({ data: interaction, api }) => {
    if (isButtonType(interaction)) {
        const button = buttons.get(interaction.data?.custom_id);
        if (!button) return;

        try {
            logger.infoSingle(`Executing button: ${button.data.name}`, "Handler");
            button.execute(interaction, api);
        } catch (error: any) {
            logger.error("Button execution error:", "Handler", error);
        }
    }

    if (!isChatInput(interaction)) return;
    const command = commands.get(interaction.data.name);

    if (!command) return;

    try {
        logger.infoSingle(`Executing command: ${command.data.name}`, "Handler");
        command.execute(interaction, api);
    } catch (error: any) {
        logger.error("Command execution error:", "Handler", error);
    }
});

await seedPrisma();
