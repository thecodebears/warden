import { WardenNode } from "./node.model";
import { Args, Resolver, Query, ResolveField, Parent, Mutation } from "@nestjs/graphql";
import { RedisService } from "@liaoliaots/nestjs-redis";
import { ids } from "webpack";

@Resolver(() => WardenNode)
export class NodesResolver {
    constructor(private readonly redisService: RedisService){}

    @Query(returns => WardenNode)
    async node(@Args('id', { type: () => String }) id: string) {
        const client = this.redisService.getClient(process.env.REDIS_CLIENT_NAME)
        const data = await client.hgetall(`node_${id}`)
        return data
    }

    @ResolveField('permissions', returns => [String])
    async getPermissions(@Parent() node: WardenNode) {
        const client = this.redisService.getClient(process.env.REDIS_CLIENT_NAME)
        const { id } = await node
        const data = await client.lrange(`node_${id}_permissions`, 0, -1)

        return data
    }

    @Mutation(returns => String)
    async migrate(
        @Args({ name: 'id', type: () => String }) id: string,
        @Args({ name: 'host', type: () => String }) host: string,
    ){
        const client = this.redisService.getClient(process.env.REDIS_CLIENT_NAME)
        const oldHost = await client.hget(`node_${id}`, 'host')

        await client.hset(`node_${id}`, 'host', host)

        return `Migration ${oldHost} -> ${host} OK`
    }

    @Mutation(returns => String)
    async createNode(
        @Args({ name: 'id', type: () => String }) id: string,
        @Args({ name: 'host', type: () => String }) host: string,
        @Args({ name: 'requestSecret', type: () => String }) requestSecret: string,
        @Args({ name: 'tokenSecret', type: () => String }) tokenSecret: string,
        @Args({ name: 'permissions', type: () => [String], nullable: true }) permissions: string[] = new Array<string>()
    ){
        const client = this.redisService.getClient(process.env.REDIS_CLIENT_NAME)
        const node = { id, host, requestSecret, tokenSecret, permissions }

        await client.hmset(`node_${id}`, node)
        await client.lpush(`node_${id}_permissions`, ...permissions)

        return `Create node ${id} OK`
    }
}
