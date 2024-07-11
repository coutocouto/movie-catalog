import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, validateSync } from "class-validator";

export type CreateUserInputProps = {
  name: string;
  email: string;
  password: string;
};

export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "John Doe", description: "The user's name" })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "user@example.com", description: "The user's email" })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "strongPassword123",
    description: "The user's password",
  })
  password: string;

  constructor(props: CreateUserInputProps) {
    if (!props) return;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
  }
}

export class ValidateCreateUserInput {
  static validate(input: CreateUserInput) {
    return validateSync(input);
  }
}
