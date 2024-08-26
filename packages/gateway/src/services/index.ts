import { REST } from "@discordjs/rest";
import { SimpleIdentifyThrottler, WebSocketManager, WebSocketShardEvents, WorkerShardingStrategy } from "@discordjs/ws";
import { env } from "core";
import { GatewayIntentBits } from "discord-api-types/v10";
import { Logger } from "log";

const rest = new REST().setToken(env.DISCORD_TOKEN);
const logger = new Logger();

const manager = new WebSocketManager({
    token: env.DISCORD_TOKEN,
    intents:
        GatewayIntentBits.Guilds |
        GatewayIntentBits.GuildMembers |
        GatewayIntentBits.GuildModeration |
        GatewayIntentBits.GuildVoiceStates |
        GatewayIntentBits.GuildMessages |
        GatewayIntentBits.GuildMessageReactions |
        GatewayIntentBits.DirectMessages |
        GatewayIntentBits.MessageContent,
    rest,
    shardCount: 2,
    buildIdentifyThrottler: async (manager) => {
        const gatewayInformation = await manager.fetchGatewayInformation();
        return new SimpleIdentifyThrottler(gatewayInformation.session_start_limit.max_concurrency);
    },
    buildStrategy: (manager) => {
        return new WorkerShardingStrategy(manager, {
            shardsPerWorker: 4,
            workerPath: `${import.meta.dirname}/worker.js`,
        });
    },
});

manager.on(WebSocketShardEvents.Resumed, ({ shardId }) => {
    logger.debugSingle(`Shard ${shardId} resumed.`, "Gateway");
});

manager.on(WebSocketShardEvents.Ready, ({ shardId }) => {
    logger.infoSingle(`Shard ${shardId} ready.`, "Gateway");
});

manager.on(WebSocketShardEvents.Closed, ({ shardId }) => {
    logger.debugSingle(`Shard ${shardId} closed.`, "Gateway");
});

manager.on(WebSocketShardEvents.Error, ({ shardId, error }) => {
    logger.error(`Shard ${shardId} errored.`, "Gateway", error);
});

manager.connect();
