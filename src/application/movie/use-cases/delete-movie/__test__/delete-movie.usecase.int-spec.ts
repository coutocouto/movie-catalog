import { TestingModule, Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule } from "../../../../../app.module";
import { MovieTypeOrmRepository } from "../../../../../infrastructure/movie/repository/movie-typeorm.repository";
import { MovieModel } from "../../../../../infrastructure/movie/repository/movie.model";
import { DeleteMovieUseCase } from "../delete-movie.usecase";
import { MovieFakeBuilder } from "../../../../../domain/movie/movie-fake.builder";

describe("DeleteMovieUseCase Integration Tests", () => {
  let deleteMovieUseCase: DeleteMovieUseCase;
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
      providers: [DeleteMovieUseCase, MovieTypeOrmRepository],
    }).compile();

    deleteMovieUseCase = module.get<DeleteMovieUseCase>(DeleteMovieUseCase);
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

  it("should delete a movie successfully", async () => {
    const movie = MovieFakeBuilder.aMovie().build();
    await movieRepository.create(movie);

    await deleteMovieUseCase.execute({ id: movie.movieId });

    const foundMovie = await movieRepository.findById(movie.movieId);
    expect(foundMovie).toBeNull();
  });

  it("should throw an error when trying to delete a non-existing movie", async () => {
    const movieId = "non-existing-movie-id";

    await expect(deleteMovieUseCase.execute({ id: movieId })).rejects.toThrow(
      "Movie not found",
    );
  });
});
