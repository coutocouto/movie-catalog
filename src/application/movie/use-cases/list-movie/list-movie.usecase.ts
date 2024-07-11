import {
  IMovieRepository,
  MovieFilter,
  MovieSearchParams,
  MovieSearchResult,
} from "../../../../domain/movie/movie.repository";
import { IUseCase } from "../../../../shared/application/usecase.interface";
import { MovieOutput, MovieOutputMapper } from "../common/movie.output";
import {
  PaginationOutput,
  PaginationOutputMapper,
} from "../../../../shared/application/pagination.output";
import { OrderDirection } from "../../../../shared/domain/repository/search-params";
import { CustomCacheService } from "../../../../shared/infrastructure/services/cache/cache.service";

export class ListMovieUseCase
  implements IUseCase<ListMovieInput, ListMoviesOutput>
{
  constructor(
    private readonly movieRepository: IMovieRepository,
    private readonly cacheManager: CustomCacheService,
  ) {}

  async execute(input: ListMovieInput): Promise<ListMoviesOutput> {
    const cacheKey = this.getCacheKey(input);
    const cachedResult =
      await this.cacheManager.get<ListMoviesOutput>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const params = new MovieSearchParams(input);
    const searchResult = await this.movieRepository.search(params);
    const output = this.toOutput(searchResult);

    await this.cacheManager.set(cacheKey, output);
    return output;
  }

  private toOutput(searchResult: MovieSearchResult): ListMoviesOutput {
    const { items: _items } = searchResult;
    const items = _items.map((i) => {
      return MovieOutputMapper.toOutput(i);
    });
    return PaginationOutputMapper.toOutput(items, searchResult);
  }

  private getCacheKey(input: ListMovieInput): string {
    const { page, perPage, orderBy, orderDirection, filter } = input;
    const filterKey = filter ? JSON.stringify(filter) : "no-filter";
    return `movies:${page}:${perPage}:${orderBy}:${orderDirection}:${filterKey}`;
  }
}

export type ListMovieInput = {
  page?: number;
  perPage?: number;
  orderBy?: string | null;
  orderDirection?: OrderDirection | null;
  filter?: MovieFilter | null;
};

export type ListMoviesOutput = PaginationOutput<MovieOutput>;
