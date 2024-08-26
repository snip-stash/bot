import { Client, GatewayDispatchEvents } from "@discordjs/core";
import { REST } from "@discordjs/rest";
import { getRedis } from "core";
import { env } from "core/dist/env.js";
import { Logger } from "log";
import { Gateway } from "./gateway.js";

const logger = new Logger();
const redis = await getRedis();

const rest = new REST().setToken(env.DISCORD_TOKEN);
const gateway = new Gateway({ redis, env });
await gateway.connect();

const client = new Client({ rest, gateway });

/*

Keeping these just for logging reasons
Feel free to discard them if you want
- Tom

*/

client.on(GatewayDispatchEvents.MessageCreate, async ({ data: message }) => {
    logger.info(`Received message : ${message.content}`, "Gateway");
});

client.on(GatewayDispatchEvents.Ready, () => {
    logger.infoSingle("Ready", "Gateway");
});

client.on(GatewayDispatchEvents.Resumed, () => {
    logger.infoSingle("Resumed", "Gateway");
});
