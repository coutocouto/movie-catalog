import { MovieTypeOrmRepository } from "../../../../../infrastructure/movie/repository/movie-typeorm.repository";
import { EntityAlreadyExists } from "../../../../../shared/domain/exceptions/entity-already-exists.exception";
import { CreateMovieInput } from "../create-movie.input";
import { CreateMovieUseCase } from "../create-movie.usecase";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";

describe("CreateMovie", () => {
  let createMovieUseCase: CreateMovieUseCase;
  let movieRepositoryMock: Partial<MovieTypeOrmRepository>;

  beforeEach(() => {
    movieRepositoryMock = {
      create: jest.fn(),
      existsByTitle: jest.fn(),
    };
    createMovieUseCase = new CreateMovieUseCase(movieRepositoryMock as any);
  });

  it("should create a movie", async () => {
    const input = new CreateMovieInput({
      title: "title",
      description: "description",
      category: "category",
      genre: "genre",
      releaseDate: new Date(),
    });
    jest.spyOn(movieRepositoryMock, "existsByTitle").mockResolvedValue(false);

    const result = await createMovieUseCase.execute(input);

    expect(movieRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(result.movieId).toBeDefined();
    expect(result.title).toEqual("title");
    expect(result.description).toEqual("description");
    expect(result.category).toEqual("category");
    expect(result.genre).toEqual("genre");
    expect(result.releaseDate).toBeDefined();
    expect(result.createdAt).toBeDefined();
  });

  it("should throw an error if the title already exists", async () => {
    jest.spyOn(movieRepositoryMock, "existsByTitle").mockResolvedValue(true);

    await expect(
      createMovieUseCase.execute(
        new CreateMovieInput({
          title: "title",
          description: "description",
          category: "category",
          genre: "genre",
          releaseDate: new Date(),
        }),
      ),
    ).rejects.toThrow(EntityAlreadyExists);
  });

  it("should create a movie with validation notification errors", async () => {
    const input = new CreateMovieInput({
      title: "t".repeat(300),
      description: "description",
      category: "category",
      genre: "genre",
      releaseDate: new Date(),
    });
    jest.spyOn(movieRepositoryMock, "existsByTitle").mockResolvedValue(false);

    await expect(createMovieUseCase.execute(input)).rejects.toThrow(
      EntityValidationError,
    );
  });
});
