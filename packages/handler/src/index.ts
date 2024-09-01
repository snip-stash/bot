import {
    type APIChatInputApplicationCommandInteraction,
    ApplicationCommandType,
    Client,
    GatewayDispatchEvents,
    InteractionType,
} from "@discordjs/core";
import { REST } from "@discordjs/rest";
import { getRedis } from "core";
import { env } from "core/dist/env.js";
import { Logger } from "log";
import { Gateway } from "./gateway.js";
import { loadCommands } from "./services/commands.js";

const logger = new Logger();
export const commands = await loadCommands();
const redis = await getRedis();
const rest = new REST().setToken(env.DISCORD_TOKEN);
const gateway = new Gateway({ redis, env });
await gateway.connect();

const client = new Client({ rest, gateway });

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
    if (
        interaction.type !== InteractionType.ApplicationCommand ||
        interaction.data.type !== ApplicationCommandType.ChatInput
    )
        return;

    const command = commands.get(interaction.data.name);

    if (!command) return;

    try {
        logger.infoSingle(`Executing command: ${command.data.name}`, "Handler");
        command.execute(interaction as APIChatInputApplicationCommandInteraction, api);
    } catch (error: any) {
        logger.error("Command execution error:", "Handler", error);
    }
});
