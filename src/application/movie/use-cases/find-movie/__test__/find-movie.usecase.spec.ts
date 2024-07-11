import { MovieTypeOrmRepository } from "../../../../../infrastructure/movie/repository/movie-typeorm.repository";
import { EntityNotFound } from "../../../../../shared/domain/exceptions/entity-not-found.exception";
import { FindMovieUseCase } from "../find-movie.usecase";

describe("FindMovieUseCase", () => {
  let findMovieUseCase: FindMovieUseCase;
  let movieRepositoryMock: Partial<MovieTypeOrmRepository>;

  beforeEach(() => {
    movieRepositoryMock = {
      findById: jest.fn(),
    };
    findMovieUseCase = new FindMovieUseCase(movieRepositoryMock as any);
  });

  it("should find a movie", async () => {
    const movieId = "movieId";
    jest.spyOn(movieRepositoryMock, "findById").mockResolvedValue({
      movieId,
    } as any);

    const result = await findMovieUseCase.execute({ id: "movieId" });

    expect(result).toEqual({ movieId });
  });

  it("should throw an error if the movie does not exist", async () => {
    jest.spyOn(movieRepositoryMock, "findById").mockResolvedValue(null);

    await expect(findMovieUseCase.execute({ id: "movieId" })).rejects.toThrow(
      EntityNotFound,
    );
  });
});
