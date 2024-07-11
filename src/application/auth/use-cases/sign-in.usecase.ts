import { UserTypeOrmRepository } from "../../../infrastructure/user/repository/typeorm/user-typeorm.repository";
import { IUseCase } from "../../../shared/application/usecase.interface";
import { BcryptService } from "../../../shared/infrastructure/services/bcrypt/bcrypt.service";
import { SignInInput } from "./sign-in.input";
import { SignInOutput } from "./sign-in.output";
import { EntityNotFound } from "../../../shared/domain/exceptions/entity-not-found.exception";
import { User } from "../../../domain/user/user.entity";
import { CustomJwtService } from "../../../shared/infrastructure/services/jwt/jwt.service";
import { InvalidPassword } from "../../../shared/domain/exceptions/invalid-password.exception";

export class SignInUseCase implements IUseCase<SignInInput, SignInOutput> {
  constructor(
    private readonly userRepository: UserTypeOrmRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: CustomJwtService,
  ) {}

  async execute(input: SignInInput): Promise<SignInOutput> {
    const user = await this.validateUser(input);
    await this.validatePassword(input, user);

    const payload = { email: user.email, sub: user.userId };
    const accessToken = this.jwtService.sign(payload);
    return new SignInOutput(accessToken);
  }

  private async validateUser(input: SignInInput): Promise<User> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new EntityNotFound("User not found");
    }
    return user;
  }

  private async validatePassword(
    input: SignInInput,
    user: User,
  ): Promise<void> {
    const isValidPassword = await this.bcryptService.comparePassword(
      input.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new InvalidPassword("Invalid password");
    }
  }
}
