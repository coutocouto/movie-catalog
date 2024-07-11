import { TestingModule, Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule } from "../../../../../app.module";
import { MovieTypeOrmRepository } from "../../../../../infrastructure/movie/repository/movie-typeorm.repository";
import { MovieModel } from "../../../../../infrastructure/movie/repository/movie.model";
import { EntityAlreadyExists } from "../../../../../shared/domain/exceptions/entity-already-exists.exception";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { CreateMovieInput } from "../create-movie.input";
import { CreateMovieUseCase } from "../create-movie.usecase";

describe("CreateMovieUseCase Integration Tests", () => {
  let createMovieUseCase: CreateMovieUseCase;
  let movieRepository: MovieTypeOrmRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          ...require("../../../../../infrastructure/config/typeorm/typeorm.config.test"),
          entities: [MovieModel],
        }),
        TypeOrmModule.forFeature([MovieModel]),
      ],
      providers: [CreateMovieUseCase, MovieTypeOrmRepository],
    }).compile();

    createMovieUseCase = module.get<CreateMovieUseCase>(CreateMovieUseCase);
    movieRepository = module.get<MovieTypeOrmRepository>(
      MovieTypeOrmRepository,
    );
  });

  afterEach(async () => {
    await movieRepository.clear();
  });

  afterAll(async () => {
    await module.close();
  });

  it("should create a movie successfully", async () => {
    const input = new CreateMovieInput({
      title: "Movie Title",
      description: "Movie Description",
      category: "Movie Category",
      genre: "Movie Genre",
      releaseDate: new Date(),
    });
    const output = await createMovieUseCase.execute(input);
    expect(output.title).toEqual(input.title);
    const foundMovie = await movieRepository.findByTitle(input.title);
    expect(foundMovie).toBeDefined();
    expect(foundMovie.title).toEqual(input.title);
  });

  it("should throw an error when trying to create a movie with an existing title", async () => {
    const input = new CreateMovieInput({
      title: "Movie Title",
      description: "Movie Description",
      category: "Movie Category",
      genre: "Movie Genre",
      releaseDate: new Date(),
    });
    await createMovieUseCase.execute(input);
    const input2 = new CreateMovieInput({
      title: "Movie Title",
      description: "Movie Description",
      category: "Movie Category",
      genre: "Movie Genre",
      releaseDate: new Date(),
    });
    await expect(createMovieUseCase.execute(input2)).rejects.toThrow(
      EntityAlreadyExists,
    );
  });

  it("should throw an error when trying to create a movie with validation notification errors", async () => {
    const input = new CreateMovieInput({
      title: "t".repeat(300),
      description: "Movie Description",
      category: "Movie Category",
      genre: "Movie Genre",
      releaseDate: new Date(),
    });
    await expect(createMovieUseCase.execute(input)).rejects.toThrow(
      EntityValidationError,
    );
  });
});
