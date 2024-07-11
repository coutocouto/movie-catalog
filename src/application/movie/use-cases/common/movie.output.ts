import { ApiProperty } from "@nestjs/swagger";
import { Movie } from "../../../../domain/movie/movie.entity";

export class MovieOutput {
  @ApiProperty({ example: "1", description: "The movie's id" })
  movieId: string;

  @ApiProperty({ example: "The Godfather", description: "The movie's title" })
  title: string;

  @ApiProperty({
    example:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    description: "The movie's description",
  })
  description: string;

  @ApiProperty({ example: "Crime", description: "The movie's category" })
  category: string;

  @ApiProperty({ example: "Drama", description: "The movie's genre" })
  genre: string;

  @ApiProperty({
    example: "2021-09-01T00:00:00.000Z",
    description: "The movie's release date",
  })
  releaseDate: Date;

  @ApiProperty({
    example: "2021-09-01T00:00:00.000Z",
    description: "The movie's creation date",
  })
  createdAt: Date;
}

export class MovieOutputMapper {
  static toOutput(movie: Movie): MovieOutput {
    return {
      movieId: movie.movieId,
      title: movie.title,
      description: movie.description,
      category: movie.category,
      genre: movie.genre,
      releaseDate: movie.releaseDate,
      createdAt: movie.createdAt,
    };
  }
}
