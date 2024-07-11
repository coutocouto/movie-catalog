import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../../../domain/user/user.entity";

export class UserOutput {
  @ApiProperty({ example: "1", description: "The user's id" })
  id: string;
  @ApiProperty({ example: "John Doe", description: "The user's name" })
  name: string;
  @ApiProperty({ example: "user@example.com", description: "The user's email" })
  email: string;
  @ApiProperty({
    example: "2021-09-01T00:00:00.000Z",
    description: "The user's creation date",
  })
  createdAt: Date;
}

export class UserOutputMapper {
  static toOutput(entity: User): UserOutput {
    return {
      id: entity.userId,
      name: entity.name,
      email: entity.email,
      createdAt: entity.createdAt,
    };
  }
}
