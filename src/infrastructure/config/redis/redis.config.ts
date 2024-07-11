import { redisStore } from "cache-manager-redis-store";

export class RedisConfig {
  public static getRedisConfig(): any {
    return {
      store: redisStore as any,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      ttl: process.env.REDIS_TTL || 300,
    };
  }
}
