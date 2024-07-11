import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateMovieInput {
  @ApiProperty({ example: "The Godfather", description: "The movie's title" })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    description: "The movie's description",
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: "Crime", description: "The movie's category" })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ example: "Drama", description: "The movie's genre" })
  @IsNotEmpty()
  @IsString()
  genre: string;

  @ApiProperty({
    example: "2021-09-01T00:00:00.000Z",
    description: "The movie's release date",
  })
  @IsNotEmpty()
  @IsString()
  releaseDate: Date;

  constructor(props: CreateMovieInput) {
    if (!props) return;
    this.title = props.title;
    this.description = props.description;
    this.category = props.category;
    this.genre = props.genre;
    this.releaseDate = props.releaseDate;
  }
}
