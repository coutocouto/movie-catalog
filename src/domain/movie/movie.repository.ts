import { ISearchableRepository } from "../../shared/domain/repository/repository.interface";
import { SearchParams } from "../../shared/domain/repository/search-params";
import { SearchResult } from "../../shared/domain/repository/search-result";
import { Movie } from "./movie.entity";

export type MovieFilter = string;

export type MovieId = string;

export class MovieSearchParams extends SearchParams<MovieFilter> {}

export class MovieSearchResult extends SearchResult<Movie> {}

export interface IMovieRepository
  extends ISearchableRepository<
    Movie,
    MovieId,
    MovieFilter,
    MovieSearchParams,
    MovieSearchResult
  > {}
