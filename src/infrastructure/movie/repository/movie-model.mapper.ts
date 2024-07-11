import { Movie } from "../../../domain/movie/movie.entity";
import { EntityValidationError } from "../../../shared/domain/validators/validation.error";
import { MovieModel } from "./movie.model";

export class MovieModelMapper {
  static toEntity(movieModel: MovieModel) {
    const movie = Movie.from({
      movieId: movieModel.movieId,
      title: movieModel.title,
      description: movieModel.description,
      category: movieModel.category,
      genre: movieModel.genre,
      releaseDate: movieModel.releaseDate,
      createdAt: movieModel.createdAt,
    });
    movie.validate();
    if (movie.notification.hasErrors()) {
      throw new EntityValidationError(movie.notification.toJSON());
    }
    return movie;
  }

  static toModel(movie: Movie) {
    return MovieModel.from(movie);
  }
}
