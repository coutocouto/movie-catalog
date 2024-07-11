import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "../controller/auth.controller";
import { JwtStrategy } from "../../../shared/infrastructure/strategies/jwt.strategy";
import { AUTH_PROVIDERS } from "./auth.providers";
import { UserModel } from "../../user/repository/typeorm/user.model";
import { CustomJwtModule } from "../../../shared/infrastructure/services/jwt/jwt.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    CustomJwtModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    ...Object.values(AUTH_PROVIDERS.REPOSITORIES),
    ...Object.values(AUTH_PROVIDERS.USE_CASES),
    ...Object.values(AUTH_PROVIDERS.SERVICES),
  ],
})
export class AuthModule {}
