import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async get(key: string): Promise<string> {
        return await this.cacheManager.get(key);
    }

    async set(key: string, value: string | object, TTL: number): Promise<void> {
        await this.cacheManager.set(key, value, { ttl: TTL });
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }
}
