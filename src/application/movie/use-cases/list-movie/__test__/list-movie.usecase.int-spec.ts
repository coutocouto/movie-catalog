import { TestingModule, Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule } from "../../../../../app.module";
import { MovieFakeBuilder } from "../../../../../domain/movie/movie-fake.builder";
import { MovieTypeOrmRepository } from "../../../../../infrastructure/movie/repository/movie-typeorm.repository";
import { MovieModel } from "../../../../../infrastructure/movie/repository/movie.model";
import { CustomCacheService } from "../../../../../shared/infrastructure/services/cache/cache.service";
import { ListMovieUseCase } from "../list-movie.usecase";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";

describe("ListMovieUseCase Integration Tests", () => {
  let listMovieUseCase: ListMovieUseCase;
  let movieRepository: MovieTypeOrmRepository;
  let cacheService: CustomCacheService;
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
        CacheModule.register({
          store: redisStore as any,
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
        }),
      ],
      providers: [ListMovieUseCase, MovieTypeOrmRepository, CustomCacheService],
    }).compile();

    listMovieUseCase = module.get<ListMovieUseCase>(ListMovieUseCase);
    movieRepository = module.get<MovieTypeOrmRepository>(
      MovieTypeOrmRepository,
    );
    cacheService = module.get<CustomCacheService>(CustomCacheService);
  });

  afterEach(async () => {
    await cacheService.reset();
    await movieRepository.clear();
  });

  afterAll(async () => {
    await module.close();
  });

  it("should list movies successfully", async () => {
    const movie = MovieFakeBuilder.aMovie()
      .withTitle("A Matrix")
      .withDescription("A computer hacker.")
      .withCategory("Action")
      .withGenre("Sci-Fi")
      .withCreatedAt(new Date("2021-01-01"))
      .build();
    const movie2 = MovieFakeBuilder.aMovie()
      .withTitle("The Matrix Reloaded")
      .withDescription("A computer hacker.")
      .withCategory("Action")
      .withGenre("Sci-Fi")
      .withCreatedAt(new Date("2020-01-01"))
      .build();

    await movieRepository.create(movie);
    await movieRepository.create(movie2);

    const output = await listMovieUseCase.execute({
      page: 1,
      perPage: 5,
      filter: null,
    });

    expect(output.items.length).toEqual(2);
    expect(output.items[0].movieId).toEqual(movie.movieId);
    expect(output.items[0].title).toEqual(movie.title);
    expect(output.items[0].description).toEqual(movie.description);
    expect(output.items[0].category).toEqual(movie.category);
    expect(output.items[0].genre).toEqual(movie.genre);
    expect(output.items[0].releaseDate).toEqual(movie.releaseDate);
    expect(output.items[0].createdAt).toEqual(movie.createdAt);
    expect(output.total).toEqual(2);
    expect(output.currentPage).toEqual(1);
    expect(output.perPage).toEqual(5);
    expect(output.lastPage).toEqual(1);
  });

  it("should list movies from cache", async () => {
    const movie = MovieFakeBuilder.aMovie()
      .withTitle("A Matrix")
      .withDescription("A computer hacker.")
      .withCategory("Action")
      .withGenre("Sci-Fi")
      .withCreatedAt(new Date("2021-01-01"))
      .build();
    await movieRepository.create(movie);

    const output = await listMovieUseCase.execute({
      page: 1,
      perPage: 1,
      orderBy: "title",
      orderDirection: "ASC",
      filter: null,
    });

    const output1 = await listMovieUseCase.execute({
      page: 1,
      perPage: 1,
      orderBy: "title",
      orderDirection: "ASC",
      filter: null,
    });

    expect(output.items.length).toEqual(1);
    expect(output.items[0].movieId).toEqual(movie.movieId);
    expect(output.items[0].title).toEqual(movie.title);
    expect(output.items[0].description).toEqual(movie.description);
    expect(output.items[0].category).toEqual(movie.category);
    expect(output.items[0].genre).toEqual(movie.genre);
    expect(output.total).toEqual(1);
    expect(output.currentPage).toEqual(1);
    expect(output.perPage).toEqual(1);
    expect(output.lastPage).toEqual(1);
    expect(output.items.length).toEqual(output1.items.length);
  });

  it("should list movies with filter", async () => {
    const movie = MovieFakeBuilder.aMovie()
      .withTitle("A Matrix Reloaded")
      .withDescription("A computer hacker.")
      .withCategory("Action")
      .withGenre("Sci-Fi")
      .withCreatedAt(new Date("2021-01-01"))
      .build();

    const movie2 = MovieFakeBuilder.aMovie()
      .withTitle("The Matrix ")
      .withDescription("A computer hacker.")
      .withCategory("Action")
      .withGenre("Sci-Fi")
      .withCreatedAt(new Date("2020-01-01"))
      .build();

    await movieRepository.create(movie);
    await movieRepository.create(movie2);

    const output = await listMovieUseCase.execute({
      page: 1,
      perPage: 1,
      orderBy: "title",
      orderDirection: "ASC",
      filter: "Reloaded",
    });

    expect(output.items.length).toEqual(1);
    expect(output.items[0].movieId).toEqual(movie.movieId);
    expect(output.items[0].title).toEqual(movie.title);
    expect(output.items[0].description).toEqual(movie.description);
    expect(output.items[0].category).toEqual(movie.category);
    expect(output.items[0].genre).toEqual(movie.genre);
    expect(output.total).toEqual(1);
    expect(output.currentPage).toEqual(1);
    expect(output.perPage).toEqual(1);
    expect(output.lastPage).toEqual(1);
  });

  it("Should list movies with pagination", async () => {
    const movies = MovieFakeBuilder.theMovies(10).build();
    await movieRepository.createMany(movies);

    const output = await listMovieUseCase.execute({
      page: 1,
      perPage: 5,
      filter: null,
    });

    expect(output.items.length).toEqual(5);
    expect(output.total).toEqual(10);
    expect(output.currentPage).toEqual(1);
    expect(output.perPage).toEqual(5);
    expect(output.lastPage).toEqual(2);
  });

  it("should list movies ordered by title", async () => {
    const movie = MovieFakeBuilder.aMovie()
      .withTitle("The Matrix")
      .withDescription("A computer hacker.")
      .withCategory("Action")
      .withGenre("Sci-Fi")
      .withCreatedAt(new Date("2021-01-01"))
      .build();

    const movie2 = MovieFakeBuilder.aMovie()
      .withTitle("A Matrix")
      .withDescription("A computer hacker.")
      .withCategory("Action")
      .withGenre("Sci-Fi")
      .withCreatedAt(new Date("2020-01-01"))
      .build();

    await movieRepository.createMany([movie, movie2]);

    const output = await listMovieUseCase.execute({
      page: 1,
      perPage: 5,
      orderBy: "title",
      orderDirection: "ASC",
      filter: null,
    });

    expect(output.items.length).toEqual(2);
    expect(output.items[0].movieId).toEqual(movie2.movieId);
    expect(output.items[0].title).toEqual(movie2.title);
    expect(output.items[0].description).toEqual(movie2.description);
    expect(output.items[0].category).toEqual(movie2.category);
    expect(output.items[0].genre).toEqual(movie2.genre);
    expect(output.items[0].releaseDate).toEqual(movie2.releaseDate);
    expect(output.items[0].createdAt).toEqual(movie2.createdAt);
    expect(output.total).toEqual(2);
    expect(output.currentPage).toEqual(1);
    expect(output.perPage).toEqual(5);
    expect(output.lastPage).toEqual(1);
  });
});
