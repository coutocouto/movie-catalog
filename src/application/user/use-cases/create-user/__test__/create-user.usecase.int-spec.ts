// src/create-user.usecase.e2e-spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../../../app.module";
import { UserTypeOrmRepository } from "../../../../../infrastructure/user/repository/typeorm/user-typeorm.repository";
import { BcryptService } from "../../../../../shared/infrastructure/services/bcrypt/bcrypt.service";
import { CreateUserUseCase } from "../create-user.usecase";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModel } from "../../../../../infrastructure/user/repository/typeorm/user.model";
import { CreateUserInput } from "../create-user.input";

describe("CreateUserUseCase Integration Tests", () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: UserTypeOrmRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          ...require("../../../../../infrastructure/config/typeorm/typeorm.config.test"),
          entities: [UserModel],
        }),
        TypeOrmModule.forFeature([UserModel]),
      ],
      providers: [CreateUserUseCase, UserTypeOrmRepository, BcryptService],
    }).compile();

    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get<UserTypeOrmRepository>(UserTypeOrmRepository);
  });

  afterEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    await module.close();
  });

  it("should create a user successfully", async () => {
    const input = new CreateUserInput({
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword",
    });
    const output = await createUserUseCase.execute(input);
    expect(output.email).toEqual(input.email);
    const foundUser = await userRepository.findByEmail(input.email);
    expect(foundUser).toBeDefined();
    expect(foundUser.email).toEqual(input.email);
    // expect(
    //   await bcryptService.comparePassword(input.password, foundUser.password),
    // ).toBe(true);
  });

  it("should throw an error when trying to create a user with an existing email", async () => {
    const input = new CreateUserInput({
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword",
    });
    await createUserUseCase.execute(input);
    const input2 = new CreateUserInput({
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword",
    });
    await expect(createUserUseCase.execute(input2)).rejects.toThrow(
      "Email already exists",
    );
  });

  it("should throw an error when trying to create a user with an invalid email", async () => {
    const input = new CreateUserInput({
      name: "John Doe",
      email: "invalid-email",
      password: "securePassword",
    });
    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      "Entity Validation Error",
    );
  });
});
