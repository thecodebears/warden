import { Module } from "@nestjs/common";
import { RedisService } from "@liaoliaots/nestjs-redis";
import { NodesResolver } from "./node.resolver";

@Module({
    providers: [RedisService, NodesResolver]
})
export class NodesModule {}