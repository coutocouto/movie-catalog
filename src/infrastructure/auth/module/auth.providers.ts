import { JwtService } from "@nestjs/jwt";
import { SignInUseCase } from "../../../application/auth/use-cases/sign-in.usecase";
import { BcryptService } from "../../../shared/infrastructure/services/bcrypt/bcrypt.service";
import { CustomJwtService } from "../../../shared/infrastructure/services/jwt/jwt.service";
import { UserTypeOrmRepository } from "../../user/repository/typeorm/user-typeorm.repository";

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
  JWT_SERVICE: {
    provide: CustomJwtService,
    useFactory: (jwtService: JwtService) => {
      return new CustomJwtService(jwtService);
    },
    inject: [JwtService],
  },
};

export const USE_CASES = {
  SIGNIN_USE_CASE: {
    provide: SignInUseCase,
    useFactory: (
      userRepo: UserTypeOrmRepository,
      bcrypt: BcryptService,
      jwtService: CustomJwtService,
    ) => {
      return new SignInUseCase(userRepo, bcrypt, jwtService);
    },
    inject: [
      REPOSITORIES.USER_REPOSITORY.provide,
      SERVICES.BCRYPT_SERVICE.provide,
      SERVICES.JWT_SERVICE.provide,
    ],
  },
};

export const AUTH_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
  SERVICES,
};
