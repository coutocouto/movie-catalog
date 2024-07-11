import { CreateMovieUseCase } from "../../../application/movie/use-cases/create-movie/create-movie.usecase";
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

export const USE_CASES = {
  CREATE_MOVIE_USE_CASE: {
    provide: CreateMovieUseCase,
    useFactory: (movieRepo: MovieTypeOrmRepository) => {
      return new CreateMovieUseCase(movieRepo);
    },
    inject: [REPOSITORIES.MOVIE_REPOSITORY.provide],
  },
};

export const MOVIE_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
