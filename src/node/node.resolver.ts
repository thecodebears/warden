import { WardenNode } from "./node.model";
import { Args, Resolver, Query, ResolveField, Parent, Mutation } from "@nestjs/graphql";
import { RedisService } from "@liaoliaots/nestjs-redis";

@Resolver(() => WardenNode)
export class NodesResolver {
    constructor(private readonly redisService: RedisService){}

    @Query(returns => WardenNode)
    async node(@Args('id', { type: () => String }) id: string) {
        const client = this.redisService.getClient(process.env.REDIS_CLIENT_NAME)
        const data = await client.hgetall(id)
        return data
    }

    @ResolveField('permissions', returns => [String])
    async getPermissions(@Parent() node: WardenNode) {
        const client = this.redisService.getClient(process.env.REDIS_CLIENT_NAME)
        const { id } = await node
        const data = await client.lrange(`${id}_permissions`, 0, -1)

        return data
    }

    @Mutation(returns => String)
    async migrate(
        @Args({ name: 'id', type: () => String }) id: string,
        @Args({ name: 'host', type: () => String }) host: string,
    ){
        const client = this.redisService.getClient(process.env.REDIS_CLIENT_NAME)
        const oldHost = await client.hget(id, 'host')

        await client.hset(id, 'host', host)
        return `Migration ${oldHost} -> ${host} OK`
    }
}
