import { MovieTypeOrmRepository } from "../../../../../infrastructure/movie/repository/movie-typeorm.repository";
import { EntityNotFound } from "../../../../../shared/domain/exceptions/entity-not-found.exception";
import { DeleteMovieUseCase } from "../delete-movie.usecase";

describe("DeleteMovieUseCase", () => {
  let deleteMovieUseCase: DeleteMovieUseCase;
  let movieRepositoryMock: Partial<MovieTypeOrmRepository>;

  beforeEach(() => {
    movieRepositoryMock = {
      delete: jest.fn(),
      findById: jest.fn(),
    };
    deleteMovieUseCase = new DeleteMovieUseCase(movieRepositoryMock as any);
  });

  it("should delete a movie", async () => {
    const movieId = "movieId";
    jest.spyOn(movieRepositoryMock, "findById").mockResolvedValue({
      movieId,
    } as any);

    await deleteMovieUseCase.execute({ id: "movieId" });

    expect(movieRepositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(movieRepositoryMock.delete).toHaveBeenCalledWith(movieId);
  });

  it("should throw an error if the movie does not exist", async () => {
    jest.spyOn(movieRepositoryMock, "findById").mockResolvedValue(null);

    await expect(deleteMovieUseCase.execute({ id: "movieId" })).rejects.toThrow(
      EntityNotFound,
    );
  });
});
