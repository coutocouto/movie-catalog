import { JwtService } from "@nestjs/jwt";
import { UserTypeOrmRepository } from "../../../../infrastructure/user/repository/typeorm/user-typeorm.repository";
import { BcryptService } from "../../../../shared/infrastructure/services/bcrypt/bcrypt.service";
import { SignInUseCase } from "../sign-in.usecase";
import { UserFakeBuilder } from "../../../../domain/user/user.fake";

describe("SignInUseCase", () => {
  let signInUseCase: SignInUseCase;
  let userRepositoryMock: Partial<UserTypeOrmRepository>;
  let bcryptServiceMock: Partial<BcryptService>;
  let jwtServiceMock: Partial<JwtService>;

  beforeEach(() => {
    userRepositoryMock = {
      findByEmail: jest.fn(),
    };
    bcryptServiceMock = {
      comparePassword: jest.fn(),
    };
    jwtServiceMock = {
      sign: jest.fn(),
    };

    signInUseCase = new SignInUseCase(
      userRepositoryMock as any,
      bcryptServiceMock as any,
      jwtServiceMock as any,
    );
  });

  it("should throw an error if the user is not found", async () => {
    jest.spyOn(userRepositoryMock, "findByEmail").mockResolvedValue(null);

    await expect(
      signInUseCase.execute({
        email: "email@example.com",
        password: "password",
      }),
    ).rejects.toThrow("User not found");
  });

  it("should throw an error if the password is invalid", async () => {
    const user = UserFakeBuilder.aUser().withPassword("hashedPassword").build();

    jest.spyOn(userRepositoryMock, "findByEmail").mockResolvedValue(user);
    jest.spyOn(bcryptServiceMock, "comparePassword").mockResolvedValue(false);

    await expect(
      signInUseCase.execute({
        email: "email@example.com",
        password: "password",
      }),
    ).rejects.toThrow("Invalid password");
  });

  it("should generate a JWT token when credentials are valid", async () => {
    const user = UserFakeBuilder.aUser()
      .withUserId("1")
      .withEmail("email@example.com")
      .withPassword("hashedPassword")
      .build();

    jest.spyOn(userRepositoryMock, "findByEmail").mockResolvedValue(user);
    jest.spyOn(bcryptServiceMock, "comparePassword").mockResolvedValue(true);
    jest.spyOn(jwtServiceMock, "sign").mockReturnValue("jwtToken");

    const result = await signInUseCase.execute({
      email: "email@example.com",
      password: "password",
    });

    expect(jwtServiceMock.sign).toHaveBeenCalledWith({
      email: "email@example.com",
      sub: "1",
    });
    expect(result.accessToken).toEqual("jwtToken");
  });
});
