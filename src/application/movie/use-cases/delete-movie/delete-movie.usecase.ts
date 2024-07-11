import { IMovieRepository } from "../../../../domain/movie/movie.repository";
import { IUseCase } from "../../../../shared/application/usecase.interface";
import { EntityNotFound } from "../../../../shared/domain/exceptions/entity-not-found.exception";

export class DeleteMovieUseCase
  implements IUseCase<DeleteMovieInput, DeleteMovieOutput>
{
  constructor(private readonly movieRepository: IMovieRepository) {}

  async execute({ id }: DeleteMovieInput): Promise<DeleteMovieOutput> {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new EntityNotFound("Movie not found");
    }
    await this.movieRepository.delete(id);
  }
}

export type DeleteMovieInput = {
  id: string;
};

type DeleteMovieOutput = void;
