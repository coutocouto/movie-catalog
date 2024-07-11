import { MovieOutputMapper } from "./../common/movie.output";
import { IMovieRepository } from "../../../../domain/movie/movie.repository";
import { IUseCase } from "../../../../shared/application/usecase.interface";
import { EntityNotFound } from "../../../../shared/domain/exceptions/entity-not-found.exception";
import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { MovieOutput } from "../common/movie.output";
import { UpdateMovieInput } from "./update-movie.input";

export class UpdateMovieUseCase
  implements IUseCase<UpdateMovieInput, UpdateMovieOutput>
{
  constructor(private movieRepository: IMovieRepository) {}

  async execute(input: UpdateMovieInput): Promise<UpdateMovieOutput> {
    const movie = await this.movieRepository.findById(input.id);

    if (!movie) {
      throw new EntityNotFound("Movie not found");
    }

    input.description && movie.changeDescription(input.description);
    input.category && movie.changeCategory(input.category);
    input.genre && movie.changeGenre(input.genre);
    input.releaseDate && movie.changeReleaseDate(input.releaseDate);

    if (movie.notification.hasErrors()) {
      throw new EntityValidationError(movie.notification.toJSON());
    }

    await this.movieRepository.update(movie);
    return MovieOutputMapper.toOutput(movie);
  }
}

export type UpdateMovieOutput = MovieOutput;
