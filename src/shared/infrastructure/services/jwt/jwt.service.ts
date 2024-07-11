import { Injectable } from "@nestjs/common";
import { IJwtService, JwtPayload } from "./jwt.interface";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class CustomJwtService implements IJwtService {
  constructor(private jwtService: JwtService) {}

  sign(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  verify(token: string) {
    return this.jwtService.verify(token);
  }

  decode(token: string) {
    return this.jwtService.decode(token);
  }
}
