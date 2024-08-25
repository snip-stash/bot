import { REST } from "@discordjs/rest";
import { SimpleIdentifyThrottler, WebSocketManager, WebSocketShardEvents, WorkerShardingStrategy } from "@discordjs/ws";
import { GatewayIntentBits } from "discord-api-types/v10";

const rest = new REST().setToken(process.env["DISCORD_TOKEN"]!);

const manager = new WebSocketManager({
    token: process.env["DISCORD_TOKEN"]!,
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
    console.log(`Shard ${shardId} resumed.`);
});

manager.on(WebSocketShardEvents.Ready, ({ shardId }) => {
    console.log(`Shard ${shardId} ready.`);
});

manager.on(WebSocketShardEvents.Closed, ({ shardId }) => {
    console.log(`Shard ${shardId} closed.`);
});

manager.on(WebSocketShardEvents.Error, ({ shardId, error }) => {
    console.error(`Shard ${shardId} errored.`, error);
});

manager.connect();