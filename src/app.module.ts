import { Module } from "@nestjs/common";
import { UserModule } from "./infrastructure/user/module/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormConfig } from "./infrastructure/config/typeorm/typeorm.config";
import { BcryptModule } from "./shared/infrastructure/services/bcrypt/bcrypt.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "./infrastructure/auth/module/auth.module";
import { CustomJwtModule } from "./shared/infrastructure/services/jwt/jwt.module";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./shared/infrastructure/filter/http-exception.filter";
import { MovieModule } from "./infrastructure/movie/module/movie.module";
import { CacheModule } from "@nestjs/cache-manager";
import { RedisConfig } from "./infrastructure/config/redis/redis.config";
import { CustomCacheModule } from "./shared/infrastructure/services/cache/cache.module";

@Module({
  imports: [
    UserModule,
    MovieModule,
    BcryptModule,
    CustomJwtModule,
    AuthModule,
    PassportModule,
    CustomCacheModule,
    TypeOrmModule.forRoot(typeormConfig.getTypeOrmConfig()),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "60m" },
    }),
    CacheModule.register(RedisConfig.getRedisConfig()),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
