import { CreateUserUseCase } from "../../../application/user/use-cases/create-user/create-user.usecase";
import { BcryptService } from "../../../shared/infrastructure/services/bcrypt/bcrypt.service";
import { UserTypeOrmRepository } from "../repository/typeorm/user-typeorm.repository";

export const REPOSITORIES = {
  USER_REPOSITORY: {
    provide: "UserRepository",
    useExisting: UserTypeOrmRepository,
  },
  USER_TYPEORM_REPOSITORY: {
    provide: UserTypeOrmRepository,
    useClass: UserTypeOrmRepository,
  },
};

export const SERVICES = {
  BCRYPT_SERVICE: {
    provide: BcryptService,
    useClass: BcryptService,
  },
};

export const USE_CASES = {
  CREATE_USER_USE_CASE: {
    provide: CreateUserUseCase,
    useFactory: (userRepo: UserTypeOrmRepository, bcrypt: BcryptService) => {
      return new CreateUserUseCase(userRepo, bcrypt);
    },
    inject: [
      REPOSITORIES.USER_REPOSITORY.provide,
      SERVICES.BCRYPT_SERVICE.provide,
    ],
  },
};

export const USER_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
  SERVICES,
};
