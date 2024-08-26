import { Client, GatewayDispatchEvents, InteractionType } from "@discordjs/core";
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
    logger.infoSingle(`Received message : ${message.content}`, "Gateway");
});

client.on(GatewayDispatchEvents.Ready, () => {
    logger.infoSingle("Ready", "Gateway");
});

client.on(GatewayDispatchEvents.Resumed, () => {
    logger.infoSingle("Resumed", "Gateway");
});

client.on(GatewayDispatchEvents.InteractionCreate, async ({ data: interaction, api }) => {
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    logger.infoSingle(`Received interaction: ${interaction}`, "Gateway");

    const command = commands.get(interaction.data.name);

    if (!command) return;

    try {
        command.execute(interaction, api);
    } catch (error: any) {
        logger.error("Command execution error:", "Gateway", error);
    }
});
