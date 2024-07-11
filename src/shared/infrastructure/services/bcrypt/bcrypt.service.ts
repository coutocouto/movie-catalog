import * as bcrypt from "bcrypt";
import { IBcryptService } from "./bcrypt.interface";

export class BcryptService implements IBcryptService {
  rounds = 10;

  async encodePassword(hashString: string): Promise<string> {
    return await bcrypt.hash(hashString, this.rounds);
  }

  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
