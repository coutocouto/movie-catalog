import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CustomJwtService } from "./jwt.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "60m" },
    }),
  ],
  providers: [CustomJwtService],
  exports: [CustomJwtService, JwtModule],
})
export class CustomJwtModule {}
