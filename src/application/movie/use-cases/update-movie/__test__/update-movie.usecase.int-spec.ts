import { TestingModule, Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule } from "../../../../../app.module";
import { MovieTypeOrmRepository } from "../../../../../infrastructure/movie/repository/movie-typeorm.repository";
import { MovieModel } from "../../../../../infrastructure/movie/repository/movie.model";
import { EntityNotFound } from "../../../../../shared/domain/exceptions/entity-not-found.exception";
import { UpdateMovieInput } from "../update-movie.input";
import { UpdateMovieUseCase } from "../update-movie.usecase";
import { MovieFakeBuilder } from "../../../../../domain/movie/movie-fake.builder";

describe("UpdateMovieUseCase Integration Tests", () => {
  let updateMovieUseCase: UpdateMovieUseCase;
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
      providers: [UpdateMovieUseCase, MovieTypeOrmRepository],
    }).compile();

    updateMovieUseCase = module.get<UpdateMovieUseCase>(UpdateMovieUseCase);
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

  it("should update a movie successfully", async () => {
    const aMovie = MovieFakeBuilder.aMovie().build();
    const movie = await movieRepository.create(aMovie);

    const input = new UpdateMovieInput({
      id: movie.movieId,
      description: "new description",
      category: "new category",
      genre: "new genre",
      releaseDate: new Date(),
    });

    const output = await updateMovieUseCase.execute(input);

    expect(output.movieId).toEqual(movie.movieId);
    expect(output.title).toEqual(movie.title);
    expect(output.description).toEqual(input.description);
    expect(output.category).toEqual(input.category);
    expect(output.genre).toEqual(input.genre);
    expect(output.releaseDate).toEqual(input.releaseDate);
    expect(output.createdAt).toEqual(movie.createdAt);
  });

  it("should throw an error when trying to update a movie that does not exist", async () => {
    const input = new UpdateMovieInput({
      id: "movieId",
      description: "description",
      category: "category",
      genre: "genre",
      releaseDate: new Date(),
    });

    await expect(updateMovieUseCase.execute(input)).rejects.toThrow(
      EntityNotFound,
    );
  });
});
