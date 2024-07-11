import { Controller, Post, Body } from "@nestjs/common";
import { SignInInput } from "../../../application/auth/use-cases/sign-in.input";
import { SignInUseCase } from "../../../application/auth/use-cases/sign-in.usecase";
import { SignInOutput } from "../../../application/auth/use-cases/sign-in.output";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private signInUseCase: SignInUseCase) {}

  @ApiOperation({ summary: "User login" })
  @ApiResponse({
    status: 200,
    description: "User successfully logged in",
    type: SignInOutput,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  @Post("login")
  async login(@Body() loginInputDto: SignInInput): Promise<SignInOutput> {
    return await this.signInUseCase.execute(loginInputDto);
  }
}
