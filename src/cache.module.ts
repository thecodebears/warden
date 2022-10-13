import {
  CACHE_MANAGER,
  Inject,
  Module,
  CacheModule as BaseCacheModule,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
import { Cache } from 'cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BaseCacheModule.registerAsync({
      useFactory: () => {
        return {
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT) || 6379,
        };
      },
    }),
  ],
  exports: [BaseCacheModule],
})
export class CacheModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}
  public onModuleInit(): any {
    const commands = ['get', 'set', 'del'];
    const cache = this.cache;

    commands.forEach((commandName) => {
      const oldCommand = cache[commandName];
      cache[commandName] = async (...args) => {
        const start = new Date();
        const result = await oldCommand.call(cache, ...args);
        const end = new Date();
        const duration = end.getTime() - start.getTime();

        args = args.slice(0, 2);
        console.log(`action ${commandName.toUpperCase()}(${args.join(', ')}) took ${duration}ms`);

        return result;
      };
    });
  }
}
