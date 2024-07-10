import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./infrastructure/user/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormConfig } from "./infrastructure/config/typeorm/typeorm.config";
import { UserModel } from "./infrastructure/user/repository/typeorm/user.model";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig.getTypeOrmConfig([UserModel])),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
