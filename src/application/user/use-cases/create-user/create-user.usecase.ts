import { IUseCase } from "./../../../../shared/application/IUseCase.interface";
import { User } from "../../../../domain/user/user.entity";
import { UserTypeOrmRepository } from "../../../../infrastructure/user/repository/typeorm/user-typeorm.repository";
import { UserOutput, UserOutputMapper } from "./user.output";
import { CreateUserInput } from "./create-user.input";
import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { BcryptService } from "../../../../shared/infrastructure/services/bcrypt/bcrypt.service";
import { EntityAlreadyExists } from "../../../../shared/domain/exceptions/entity-already-exists.exception";

export class CreateUserUseCase
  implements IUseCase<CreateUserInput, CreateUserOutput>
{
  constructor(
    private readonly userRepository: UserTypeOrmRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    if (await this.userRepository.existsByEmail(input.email)) {
      throw new EntityAlreadyExists("Email already exists");
    }
    input.password = await this.bcryptService.encodePassword(input.password);
    const user = User.create(input.name, input.email, input.password);
    if (user.notification.hasErrors()) {
      throw new EntityValidationError(user.notification.toJSON());
    }
    await this.userRepository.create(user);
    return UserOutputMapper.toOutput(user);
  }
}

export type CreateUserOutput = UserOutput;
