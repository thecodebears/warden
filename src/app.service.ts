import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

const KEY = 'hello';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  async getHello(): Promise<string> {
    const name = await this.cache.get(KEY) || 'undefined';
    return `Hello ${name}!`;
  }

  async setHello(name: string): Promise<void> {
    await this.cache.set(KEY, name, {ttl: 3600});
  }
}
