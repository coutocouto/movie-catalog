import { Controller, Post, Body } from "@nestjs/common";
import { CreateUserUseCase } from "../../../application/user/use-cases/create-user/create-user.usecase";
import { CreateUserInput } from "../../../application/user/use-cases/create-user/create-user.input";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserOutput } from "../../../application/user/use-cases/create-user/user.output";

@Controller("users")
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @ApiOperation({ summary: "User create" })
  @ApiResponse({
    status: 200,
    description: "User successfully created",
    type: UserOutput,
  })
  @ApiResponse({ status: 404, description: "User already exists" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @Post()
  create(@Body() createUserDto: CreateUserInput) {
    return this.createUserUseCase.execute(createUserDto);
  }
}
