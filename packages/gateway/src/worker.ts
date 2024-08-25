import { workerData } from "node:worker_threads";
import { WebSocketShardEvents, WorkerBootstrapper } from "@discordjs/ws";
import { calculateWorkerId, env } from "core";
import { Logger } from "log";

const bootstrapper = new WorkerBootstrapper();
const logger = new Logger();

const workerId = calculateWorkerId(workerData.shardIds, env.SHARDS_PER_WORKER);
logger.info("Starting...", `Worker ${workerId}`, { shardIds: workerData.shardIds });

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
            logger.debugSingle(`Shard ${shard.id} received event ${event.data.t}`, "Gateway");
        });
    },
});
