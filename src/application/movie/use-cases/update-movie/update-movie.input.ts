import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class UpdateMovieInput {
  @ApiProperty({
    example: "60f1a4c0c1c1f4b4f4e2f1b7",
    description: "The movie's id",
  })
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({
    example:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    description: "The movie's description",
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: "Crime", description: "The movie's category" })
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty({ example: "Drama", description: "The movie's genre" })
  @IsOptional()
  @IsString()
  genre: string;

  @ApiProperty({
    example: "2021-09-01T00:00:00.000Z",
    description: "The movie's release date",
  })
  @IsOptional()
  @IsString()
  releaseDate: Date;
}
