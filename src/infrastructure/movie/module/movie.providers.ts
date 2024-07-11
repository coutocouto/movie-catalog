import { CreateMovieUseCase } from "../../../application/movie/use-cases/create-movie/create-movie.usecase";
import { DeleteMovieUseCase } from "../../../application/movie/use-cases/delete-movie/delete-movie.usecase";
import { FindMovieUseCase } from "../../../application/movie/use-cases/find-movie/find-movie.usecase";
import { ListMovieUseCase } from "../../../application/movie/use-cases/list-movie/list-movie.usecase";
import { UpdateMovieUseCase } from "../../../application/movie/use-cases/update-movie/update-movie.usecase";
import { CustomCacheService } from "../../../shared/infrastructure/services/cache/cache.service";
import { MovieTypeOrmRepository } from "../repository/movie-typeorm.repository";

export const REPOSITORIES = {
  MOVIE_REPOSITORY: {
    provide: "MovieRepository",
    useExisting: MovieTypeOrmRepository,
  },
  MOVIE_TYPEORM_REPOSITORY: {
    provide: MovieTypeOrmRepository,
    useClass: MovieTypeOrmRepository,
  },
};

export const SERVICES = {
  CACHE_SERVICE: {
    provide: CustomCacheService,
    useClass: CustomCacheService,
  },
};

export const USE_CASES = {
  CREATE_MOVIE_USE_CASE: {
    provide: CreateMovieUseCase,
    useFactory: (movieRepo: MovieTypeOrmRepository) => {
      return new CreateMovieUseCase(movieRepo);
    },
    inject: [REPOSITORIES.MOVIE_REPOSITORY.provide],
  },
  UPDATE_MOVIE_USE_CASE: {
    provide: UpdateMovieUseCase,
    useFactory: (movieRepo: MovieTypeOrmRepository) => {
      return new UpdateMovieUseCase(movieRepo);
    },
    inject: [REPOSITORIES.MOVIE_REPOSITORY.provide],
  },
  FIND_MOVIE_USE_CASE: {
    provide: FindMovieUseCase,
    useFactory: (movieRepo: MovieTypeOrmRepository) => {
      return new FindMovieUseCase(movieRepo);
    },
    inject: [REPOSITORIES.MOVIE_REPOSITORY.provide],
  },
  DELETE_MOVIE_USE_CASE: {
    provide: DeleteMovieUseCase,
    useFactory: (movieRepo: MovieTypeOrmRepository) => {
      return new DeleteMovieUseCase(movieRepo);
    },
    inject: [REPOSITORIES.MOVIE_REPOSITORY.provide],
  },
  LIST_MOVIE_USE_CASE: {
    provide: ListMovieUseCase,
    useFactory: (
      movieRepo: MovieTypeOrmRepository,
      cache: CustomCacheService,
    ) => {
      return new ListMovieUseCase(movieRepo, cache);
    },
    inject: [
      REPOSITORIES.MOVIE_REPOSITORY.provide,
      SERVICES.CACHE_SERVICE.provide,
    ],
  },
};

export const MOVIE_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
  SERVICES,
};
