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
import { HttpExceptionFilter } from "./shared/infrastructure/interceptors/http-exception.filter";
import { MovieModule } from "./infrastructure/movie/module/movie.module";

@Module({
  imports: [
    UserModule,
    MovieModule,
    BcryptModule,
    CustomJwtModule,
    AuthModule,
    PassportModule,
    TypeOrmModule.forRoot(typeormConfig.getTypeOrmConfig()),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "60m" },
    }),
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
