import { ConfigModule } from '@nestjs/config';
import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from './cache.service';

@Module({
    imports: [
        ConfigModule,
        CacheModule.register({
            store: redisStore,
            host: 'localhost',
            port: 6379,
        }),
    ],
    providers: [CacheService],
    controllers: [],
    exports: [CacheService],
})
export class cacheModule {}
