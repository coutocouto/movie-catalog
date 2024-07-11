import { MovieFakeBuilder } from "../../../../../domain/movie/movie-fake.builder";
import {
  IMovieRepository,
  MovieSearchResult,
} from "../../../../../domain/movie/movie.repository";
import { CustomCacheService } from "../../../../../shared/infrastructure/services/cache/cache.service";
import { ListMovieUseCase } from "../list-movie.usecase";

describe("ListMovieUseCase", () => {
  let listMovieUseCase: ListMovieUseCase;
  let movieRepositoryMock: Partial<IMovieRepository>;
  let cacheManagerMock: Partial<CustomCacheService>;

  beforeEach(() => {
    movieRepositoryMock = {
      search: jest.fn(),
    };
    cacheManagerMock = {
      get: jest.fn(),
      set: jest.fn(),
    };
    listMovieUseCase = new ListMovieUseCase(
      movieRepositoryMock as any,
      cacheManagerMock as any,
    );
  });

  it("should list movies", async () => {
    const searchResult = new MovieSearchResult({
      items: [MovieFakeBuilder.aMovie().build()],
      total: 1,
      currentPage: 1,
      perPage: 10,
    });
    jest.spyOn(movieRepositoryMock, "search").mockResolvedValue(searchResult);

    const input = {
      page: 1,
      perPage: 1,
      orderBy: 1,
      orderDirection: 1,
      filter: "1",
    } as any;

    const output = await listMovieUseCase.execute(input);

    expect(movieRepositoryMock.search).toHaveBeenCalledTimes(1);
    expect(output).toEqual({
      items: [
        {
          movieId: searchResult.items[0].movieId,
          title: searchResult.items[0].title,
          description: searchResult.items[0].description,
          category: searchResult.items[0].category,
          genre: searchResult.items[0].genre,
          releaseDate: searchResult.items[0].releaseDate,
          createdAt: searchResult.items[0].createdAt,
        },
      ],
      total: 1,
      currentPage: 1,
      perPage: 10,
      lastPage: 1,
    });
  });

  it("should list movies from cache", async () => {
    const searchResult = new MovieSearchResult({
      items: [MovieFakeBuilder.aMovie().build()],
      total: 1,
      currentPage: 1,
      perPage: 10,
    });
    jest.spyOn(movieRepositoryMock, "search").mockResolvedValue(searchResult);
    jest.spyOn(cacheManagerMock, "get").mockResolvedValue({
      items: [
        {
          movieId: searchResult.items[0].movieId,
          title: searchResult.items[0].title,
          description: searchResult.items[0].description,
          category: searchResult.items[0].category,
          genre: searchResult.items[0].genre,
          releaseDate: searchResult.items[0].releaseDate,
          createdAt: searchResult.items[0].createdAt,
        },
      ],
      total: 1,
      currentPage: 1,
      perPage: 10,
      lastPage: 1,
    });

    const input = {
      page: 1,
      perPage: 10,
      orderBy: "title",
      orderDirection: "ASC",
      filter: null,
    } as any;

    const output = await listMovieUseCase.execute(input);

    expect(movieRepositoryMock.search).toHaveBeenCalledTimes(0);
    expect(cacheManagerMock.get).toHaveBeenCalledTimes(1);
    expect(output).toEqual({
      items: [
        {
          movieId: searchResult.items[0].movieId,
          title: searchResult.items[0].title,
          description: searchResult.items[0].description,
          category: searchResult.items[0].category,
          genre: searchResult.items[0].genre,
          releaseDate: searchResult.items[0].releaseDate,
          createdAt: searchResult.items[0].createdAt,
        },
      ],
      total: 1,
      currentPage: 1,
      perPage: 10,
      lastPage: 1,
    });
  });

  it("should list movies with no filter", async () => {
    const searchResult = new MovieSearchResult({
      items: [MovieFakeBuilder.aMovie().build()],
      total: 1,
      currentPage: 1,
      perPage: 10,
    });
    jest.spyOn(movieRepositoryMock, "search").mockResolvedValue(searchResult);

    const input = {
      page: 1,
      perPage: 10,
      orderBy: "title",
      orderDirection: "ASC",
      filter: null,
    } as any;

    await listMovieUseCase.execute(input);

    expect(movieRepositoryMock.search).toHaveBeenCalledTimes(1);
    expect(movieRepositoryMock.search).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        perPage: 10,
        orderBy: "title",
        orderDirection: "ASC",
        filter: null,
      }),
    );
  });
});
