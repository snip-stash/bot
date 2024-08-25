import { WebSocketShardEvents, WorkerBootstrapper } from "@discordjs/ws";

const bootstrapper = new WorkerBootstrapper();

void bootstrapper.bootstrap({
    forwardEvents: [
        WebSocketShardEvents.Closed,
        WebSocketShardEvents.Ready,
        WebSocketShardEvents.Resumed,
        WebSocketShardEvents.Error,
        WebSocketShardEvents.Hello,
    ],
    shardCallback: (shard) => {
        shard.on(WebSocketShardEvents.Dispatch, async (event) => {
            console.log(`Shard ${shard.id} received event ${event.data.t}`);
        });
    },
});
