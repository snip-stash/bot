import {
    type API,
    type APIChatInputApplicationCommandInteraction,
    type APIInteraction,
    type APIMessageComponentInteraction,
    type APIModalSubmitInteraction,
    ApplicationCommandType,
    Client,
    ComponentType,
    GatewayDispatchEvents,
    InteractionType,
} from "@discordjs/core";

import { REST } from "@discordjs/rest";
import { getRedis } from "core";
import { env } from "core/dist/env.js";
import { seedPrisma } from "database";
import { Logger } from "log";
import { ButtonInteraction } from "./classes/buttonInteraction.js";
import { CommandInteraction } from "./classes/commandInteraction.js";
import { ModalInteraction } from "./classes/modalInteraction.js";
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

function determineType(
    interaction: APIInteraction,
    type: InteractionType,
): interaction is
    | APIChatInputApplicationCommandInteraction
    | APIMessageComponentInteraction
    | APIModalSubmitInteraction {
    switch (type) {
        case InteractionType.ApplicationCommand:
            return (
                (interaction as APIChatInputApplicationCommandInteraction).data?.type ===
                ApplicationCommandType.ChatInput
            );
        case InteractionType.MessageComponent:
            return (interaction as APIMessageComponentInteraction).data.component_type === ComponentType.Button;
        case InteractionType.ModalSubmit:
            return (interaction as APIModalSubmitInteraction).type === InteractionType.ModalSubmit;
        default:
            return false;
    }
}

const interactionHandle: Record<string, (interaction: any, api: any) => void> = {
    ModalSubmit: (interaction: APIModalSubmitInteraction, api: API) => {
        logger.infoSingle(`Received modal interaction: ${interaction.data.custom_id}`, "Handler");
        const modal = modals.get(interaction.data.custom_id);
        if (!modal) return;

        try {
            logger.infoSingle(`Executing modal: ${modal.custom_id}`, "Handler");
            modal.execute(new ModalInteraction(interaction, api));
        } catch (error: any) {
            logger.error("Modal execution error:", "Handler", error);
        }
    },

    MessageComponent: (interaction: APIMessageComponentInteraction, api: API) => {
        const button = buttons.get(interaction.data?.custom_id);
        if (!button) return;

        try {
            logger.infoSingle(`Executing button: ${button.custom_id}`, "Handler");
            button.execute(new ButtonInteraction(interaction, api));
        } catch (error: any) {
            logger.error("Button execution error:", "Handler", error);
        }
    },

    ApplicationCommand: (interaction: APIChatInputApplicationCommandInteraction, api: API) => {
        const command = commands.get(interaction.data.name);
        if (!command) return;

        try {
            logger.infoSingle(`Executing command: ${command.data.name}`, "Handler");
            command.execute(new CommandInteraction(interaction, api));
        } catch (error: any) {
            logger.error("Command execution error:", "Handler", error);
        }
    },
};

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
    if (determineType(interaction, interaction.type)) {
        const interactionType = interaction.type;

        const handler = interactionHandle[InteractionType[interactionType]];

        if (handler) {
            handler(interaction, api);
        } else {
            logger.warn(`No handler found for interaction type: ${interaction.type}`, "Handler");
        }
    } else {
        logger.warn(`Unknown interaction type: ${interaction.type}`, "Handler");
    }
});

await seedPrisma();
