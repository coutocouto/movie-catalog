import { TestingModule, Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule } from "../../../../../app.module";
import { MovieFakeBuilder } from "../../../../../domain/movie/movie-fake.builder";
import { MovieTypeOrmRepository } from "../../../../../infrastructure/movie/repository/movie-typeorm.repository";
import { MovieModel } from "../../../../../infrastructure/movie/repository/movie.model";
import { FindMovieUseCase } from "../find-movie.usecase";

describe("FindMovieUseCase Integration Tests", () => {
  let findMovieUseCase: FindMovieUseCase;
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
      providers: [FindMovieUseCase, MovieTypeOrmRepository],
    }).compile();

    findMovieUseCase = module.get<FindMovieUseCase>(FindMovieUseCase);
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

  it("should find a movie successfully", async () => {
    const movie = MovieFakeBuilder.aMovie().build();
    await movieRepository.create(movie);

    const foundMovie = await findMovieUseCase.execute({ id: movie.movieId });

    expect(foundMovie.movieId).toEqual(movie.movieId);
    expect(foundMovie.title).toEqual(movie.title);
    expect(foundMovie.description).toEqual(movie.description);
    expect(foundMovie.category).toEqual(movie.category);
    expect(foundMovie.genre).toEqual(movie.genre);
    expect(foundMovie.releaseDate).toEqual(movie.releaseDate);
  });

  it("should throw an error when trying to find a non-existing movie", async () => {
    const movieId = "non-existing-movie-id";

    await expect(findMovieUseCase.execute({ id: movieId })).rejects.toThrow(
      "Movie not found",
    );
  });
});
