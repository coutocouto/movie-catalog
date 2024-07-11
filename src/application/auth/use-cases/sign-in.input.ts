import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, validateSync } from "class-validator";
type SignInInputProps = {
  email: string;
  password: string;
};

export class SignInInput {
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

  constructor(props: SignInInputProps) {
    if (!props) return;
    this.email = props.email;
    this.password = props.password;
  }
}

export class ValidateSignInInput {
  static validate(input: SignInInput) {
    return validateSync(input);
  }
}
