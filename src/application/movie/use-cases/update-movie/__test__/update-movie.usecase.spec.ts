import { MovieFakeBuilder } from "../../../../../domain/movie/movie-fake.builder";
import { MovieTypeOrmRepository } from "../../../../../infrastructure/movie/repository/movie-typeorm.repository";
import { EntityNotFound } from "../../../../../shared/domain/exceptions/entity-not-found.exception";
import { UpdateMovieInput } from "../update-movie.input";
import { UpdateMovieUseCase } from "../update-movie.usecase";

describe("UpdateMovieUseCase", () => {
  let updateMovieUseCase: UpdateMovieUseCase;
  let movieRepositoryMock: Partial<MovieTypeOrmRepository>;

  beforeEach(() => {
    movieRepositoryMock = {
      update: jest.fn(),
      findById: jest.fn(),
    };
    updateMovieUseCase = new UpdateMovieUseCase(movieRepositoryMock as any);
  });

  it("should update a movie", async () => {
    const movie = MovieFakeBuilder.aMovie().build();

    jest.spyOn(movieRepositoryMock, "findById").mockResolvedValue(movie);

    const input = new UpdateMovieInput({
      id: "movieId",
      description: "description",
      category: "category",
      genre: "genre",
      releaseDate: new Date(),
    });

    const output = await updateMovieUseCase.execute(input);

    expect(movieRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(output).toEqual({
      movieId: movie.movieId,
      title: movie.title,
      description: movie.description,
      category: movie.category,
      genre: movie.genre,
      releaseDate: movie.releaseDate,
      createdAt: movie.createdAt,
    });
  });

  it("should throw an error if the movie does not exist", async () => {
    jest.spyOn(movieRepositoryMock, "findById").mockResolvedValue(null);

    await expect(
      updateMovieUseCase.execute({
        id: "movieId",
        description: "description",
        category: "category",
        genre: "genre",
        releaseDate: new Date(),
      }),
    ).rejects.toThrow(EntityNotFound);
  });
});
