import { Module } from "@nestjs/common";
import { CustomCacheService } from "./cache.service";
import { CacheModule } from "@nestjs/cache-manager";
import { RedisConfig } from "../../../../infrastructure/config/redis/redis.config";

@Module({
  imports: [CacheModule.register(RedisConfig.getRedisConfig())],
  providers: [CustomCacheService],
  exports: [CustomCacheService, CacheModule],
})
export class CustomCacheModule {}
