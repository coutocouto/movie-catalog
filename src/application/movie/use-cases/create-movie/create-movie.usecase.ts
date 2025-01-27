import { Movie } from "../../../../domain/movie/movie.entity";
import { MovieTypeOrmRepository } from "../../../../infrastructure/movie/repository/movie-typeorm.repository";
import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { MovieOutput, MovieOutputMapper } from "../common/movie.output";
import { IUseCase } from "../../../../shared/application/usecase.interface";
import { CreateMovieInput } from "./create-movie.input";
import { EntityAlreadyExists } from "../../../../shared/domain/exceptions/entity-already-exists.exception";

export class CreateMovieUseCase
  implements IUseCase<CreateMovieInput, CreateMovieOutput>
{
  constructor(private readonly movieRepository: MovieTypeOrmRepository) {}

  async execute(input: CreateMovieInput): Promise<CreateMovieOutput> {
    if (await this.movieRepository.existsByTitle(input.title)) {
      throw new EntityAlreadyExists("Movie already exists");
    }
    const movie = Movie.create({
      title: input.title,
      description: input.description,
      category: input.category,
      genre: input.genre,
      releaseDate: input.releaseDate,
    });

    if (movie.notification.hasErrors()) {
      throw new EntityValidationError(movie.notification.toJSON());
    }

    await this.movieRepository.create(movie);
    return MovieOutputMapper.toOutput(movie);
  }
}

export type CreateMovieOutput = MovieOutput;
