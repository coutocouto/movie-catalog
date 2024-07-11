import { Module } from "@nestjs/common";
import { UserController } from "../controller/user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModel } from "../repository/typeorm/user.model";
import { USER_PROVIDERS } from "./user.providers";

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [
    ...Object.values(USER_PROVIDERS.REPOSITORIES),
    ...Object.values(USER_PROVIDERS.USE_CASES),
    ...Object.values(USER_PROVIDERS.SERVICES),
  ],
})
export class UserModule {}
