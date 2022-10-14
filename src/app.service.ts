import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { sign } from 'jsonwebtoken';

const KEY = 'hello';

@Injectable()
export class AppService {
	client: any;

	constructor(
		@Inject(CACHE_MANAGER) private readonly cache: Cache,
		private readonly redisService: RedisService
	) {
		this.client = this.redisService.getClient(process.env.REDIS_CLIENT_NAME)
	}
	
	async getHello(): Promise<string> {
    	const name = await this.cache.get(KEY) || 'undefined';
    	return `Hello ${name}!`;
  	}

  	async setHello(name: string): Promise<void> {
    	await this.cache.set(KEY, name, { ttl: 3600 });
  	}

	async createVerificationToken(host: string, permissions: string[]): Promise<string> {
		const timestamp = Date.now()
		const tokenSecret = await this.client.get('tokenSecret')
		const token = await sign({
			host,
			permissions, 
			timestamp
		}, tokenSecret, {
			algorithm: 'HS256',
			expiresIn: 300
		})

		await this.cache.set(host, token, { ttl: 300 })
		return token
	}
}
