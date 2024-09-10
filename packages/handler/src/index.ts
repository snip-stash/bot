import {
    type APIChatInputApplicationCommandInteraction,
    type APIMessageComponentInteraction,
    type APIModalSubmitInteraction,
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
import { ButtonInteraction } from "./classes/ButtonInteraction.js";
import { CommandInteraction } from "./classes/CommandInteraction.js";
import { ModalInteraction } from "./classes/ModalInteraction.js";
import { Gateway } from "./gateway.js";
import { FileType, load } from "./services/commands.js";

const logger = new Logger();
export const commands = await load(FileType.Commands);
export const buttons = await load(FileType.Buttons);
export const modals = await load(FileType.Modals);
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
        interaction.data.component_type === ComponentType.Button
    );
}

function isModalType(interaction: any): interaction is APIModalSubmitInteraction {
    return interaction.type === InteractionType.ModalSubmit;
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
    if (isModalType(interaction)) {
        logger.infoSingle(`Received modal interaction: ${interaction.data.custom_id}`, "Handler");
        const modal = modals.get(interaction.data.custom_id);
        if (!modal) return;

        try {
            logger.infoSingle(`Executing modal: ${modal.custom_id}`, "Handler");
            modal.execute(new ModalInteraction(interaction, api));
        } catch (error: any) {
            logger.error("Modal execution error:", "Handler", error);
        }
    }

    if (isButtonType(interaction)) {
        const button = buttons.get(interaction.data?.custom_id);
        if (!button) return;

        try {
            logger.infoSingle(`Executing button: ${button.custom_id}`, "Handler");
            button.execute(new ButtonInteraction(interaction, api));
        } catch (error: any) {
            logger.error("Button execution error:", "Handler", error);
        }
    }

    if (isChatInput(interaction)) {
        const command = commands.get(interaction.data.name);

        if (!command) return;

        try {
            logger.infoSingle(`Executing command: ${command.data.name}`, "Handler");
            command.execute(new CommandInteraction(interaction, api));
        } catch (error: any) {
            logger.error("Command execution error:", "Handler", error);
        }
    }
});

await seedPrisma();
