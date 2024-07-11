import { UserFakeBuilder } from "../../../../../domain/user/user.fake";
import { UserTypeOrmRepository } from "../../../../../infrastructure/user/repository/typeorm/user-typeorm.repository";
import { EntityAlreadyExists } from "../../../../../shared/domain/exceptions/entity-already-exists.exception";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { BcryptService } from "../../../../../shared/infrastructure/services/bcrypt/bcrypt.service";
import { CreateUserInput } from "../create-user.input";
import { CreateUserUseCase } from "../create-user.usecase";

describe("CreateUserUseCase", () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepositoryMock: Partial<UserTypeOrmRepository>;
  let bcryptServiceMock: Partial<BcryptService>;

  beforeEach(() => {
    userRepositoryMock = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
    };
    bcryptServiceMock = {
      encodePassword: jest.fn(),
    };
    createUserUseCase = new CreateUserUseCase(
      userRepositoryMock as any,
      bcryptServiceMock as any,
    );
  });

  it("should create a user", async () => {
    const input = new CreateUserInput({
      name: "name",
      email: "email@email.com",
      password: "password",
    });
    jest.spyOn(userRepositoryMock, "existsByEmail").mockResolvedValue(false);
    jest
      .spyOn(bcryptServiceMock, "encodePassword")
      .mockResolvedValue("encodedPassword");

    const result = await createUserUseCase.execute(input);

    expect(bcryptServiceMock.encodePassword).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(result.id).toBeDefined();
    expect(result.name).toEqual("name");
    expect(result.email).toEqual("email@email.com");
    expect(result.createdAt).toBeDefined();
  });

  it("should throw an error if the email already exists", async () => {
    jest.spyOn(userRepositoryMock, "existsByEmail").mockResolvedValue(true);

    await expect(
      createUserUseCase.execute(
        new CreateUserInput({
          name: "name",
          email: "email@email.com",
          password: "password",
        }),
      ),
    ).rejects.toThrow(EntityAlreadyExists);
  });

  it("should handle validation errors from the domain", async () => {
    jest.spyOn(userRepositoryMock, "existsByEmail").mockResolvedValue(false);
    jest
      .spyOn(bcryptServiceMock, "encodePassword")
      .mockResolvedValue("encodedPassword");
    const mockUser = UserFakeBuilder.aUser()
      .withName("name")
      .withEmail("email@example.com")
      .withPassword("encodedPassword")
      .build();

    mockUser.notification.addError("Error", "ValidationError");

    jest.spyOn(userRepositoryMock, "create").mockImplementation(() => {
      if (mockUser.notification.hasErrors()) {
        throw new EntityValidationError(mockUser.notification.toJSON());
      }
      return Promise.resolve(mockUser);
    });

    await expect(
      createUserUseCase.execute(
        new CreateUserInput({
          name: "name",
          email: "email@email.com",
          password: "password",
        }),
      ),
    ).rejects.toThrow(EntityValidationError);
  });
});
