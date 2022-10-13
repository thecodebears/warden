import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './cache.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { NodesResolver } from './node/node.resolver';

@Module({
    imports: [
		CacheModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true
		}),
		RedisModule.forRoot({
			config: {
				host: process.env.REDIS_HOST,
				port: parseInt(process.env.REDIS_PORT) || 6379,
				namespace: process.env.REDIS_CLIENT_NAME,
				password: process.env.REDIS_CLIENT_PASSWORD
			}
		})
	],
    controllers: [AppController],
  	providers: [AppService, NodesResolver]
})

export class AppModule {}
