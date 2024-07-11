import { IMovieRepository } from "../../../../domain/movie/movie.repository";
import { IUseCase } from "../../../../shared/application/usecase.interface";
import { EntityNotFound } from "../../../../shared/domain/exceptions/entity-not-found.exception";
import { MovieOutput, MovieOutputMapper } from "../common/movie.output";

export class FindMovieUseCase
  implements IUseCase<FindMovieInput, FindMovieOutput>
{
  constructor(private readonly movieRepository: IMovieRepository) {}

  async execute(input: FindMovieInput): Promise<FindMovieOutput> {
    const movie = await this.movieRepository.findById(input.id);
    if (!movie) {
      throw new EntityNotFound("Movie not found");
    }
    return MovieOutputMapper.toOutput(movie);
  }
}

export type FindMovieInput = {
  id: string;
};

export type FindMovieOutput = MovieOutput;
