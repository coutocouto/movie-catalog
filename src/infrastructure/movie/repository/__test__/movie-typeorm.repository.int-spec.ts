import { Test, TestingModule } from "@nestjs/testing";
import { MovieTypeOrmRepository } from "../movie-typeorm.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MovieModel } from "../movie.model";
import { MovieFakeBuilder } from "../../../../domain/movie/movie-fake.builder";
import { SearchParams } from "../../../../shared/domain/repository/search-params";

describe("movie typeorm repository int teste", () => {
  let movieRepository: MovieTypeOrmRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...require("../../../config/typeorm/typeorm.config.test"),
          entities: [MovieModel],
        }),
        TypeOrmModule.forFeature([MovieModel]),
      ],
      providers: [MovieTypeOrmRepository],
    }).compile();

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

  it("should be defined", () => {
    expect(movieRepository).toBeDefined();
  });

  describe("CRUD operations", () => {
    it("should create and retrieve a movie", async () => {
      const movie = MovieFakeBuilder.aMovie()
        .withTitle("The Godfather")
        .build();

      const createdMovie = await movieRepository.create(movie);
      expect(createdMovie).toBeDefined();
      expect(createdMovie.title).toEqual("The Godfather");

      const foundMovie = await movieRepository.findById(createdMovie.movieId);
      expect(foundMovie).toBeDefined();
      expect(foundMovie.title).toEqual("The Godfather");
    });

    it("should update a movie", async () => {
      const movie = MovieFakeBuilder.aMovie()
        .withTitle("The Godfather")
        .build();
      const createdMovie = await movieRepository.create(movie);
      expect(createdMovie).toBeDefined();
      expect(createdMovie.title).toEqual("The Godfather");

      createdMovie.changeTitle("The Godfather II");
      const updatedMovie = await movieRepository.update(createdMovie);
      expect(updatedMovie).toBeDefined();
      expect(updatedMovie.title).toEqual("The Godfather II");
    });

    it("should delete a movie", async () => {
      const movie = MovieFakeBuilder.aMovie()
        .withTitle("The Godfather")
        .build();
      const createdMovie = await movieRepository.create(movie);
      expect(createdMovie).toBeDefined();
      expect(createdMovie.title).toEqual("The Godfather");

      await movieRepository.delete(createdMovie.movieId);
      const foundMovie = await movieRepository.findById(createdMovie.movieId);
      expect(foundMovie).toBeNull();
    });

    it("should find all movies", async () => {
      const movie1 = MovieFakeBuilder.aMovie()
        .withTitle("The Godfather")
        .build();
      const movie2 = MovieFakeBuilder.aMovie()
        .withTitle("The Godfather II")
        .build();
      await movieRepository.create(movie1);
      await movieRepository.create(movie2);

      const movies = await movieRepository.findAll();
      expect(movies).toHaveLength(2);
    });
  });

  describe("search operations", () => {
    it("should search movies by title", async () => {
      const movie1 = MovieFakeBuilder.aMovie()
        .withTitle("The Godfather")
        .build();
      const movie2 = MovieFakeBuilder.aMovie()
        .withTitle("The Godfather II")
        .build();
      await movieRepository.create(movie1);
      await movieRepository.create(movie2);

      const searchParams = new SearchParams({
        filter: "II",
        page: 1,
        perPage: 10,
      });
      const searchResult = await movieRepository.search(searchParams);

      expect(searchResult).toBeDefined();
      expect(searchResult.items).toHaveLength(1);
      expect(searchResult.total).toBe(1);
    });

    it("should search movies by description", async () => {
      const movie1 = MovieFakeBuilder.aMovie()
        .withDescription("The Godfather")
        .build();
      const movie2 = MovieFakeBuilder.aMovie()
        .withDescription("The Godfather II")
        .build();
      await movieRepository.create(movie1);
      await movieRepository.create(movie2);

      const searchParams = new SearchParams({
        filter: "II",
        page: 1,
        perPage: 10,
      });
      const searchResult = await movieRepository.search(searchParams);

      expect(searchResult).toBeDefined();
      expect(searchResult.items).toHaveLength(1);
      expect(searchResult.total).toBe(1);
    });
  });
});
