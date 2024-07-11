import { BaseEntity, Column, Entity } from "typeorm";
import { Movie } from "../../../domain/movie/movie.entity";

@Entity({ name: "movies" })
export class MovieModel extends BaseEntity {
  @Column({ primary: true })
  movieId: string;
  @Column({ nullable: false, unique: true })
  title: string;
  @Column()
  description: string;
  @Column({ nullable: false })
  category: string;
  @Column({ nullable: false })
  genre: string;
  @Column({ nullable: false })
  releaseDate: Date;
  @Column({ nullable: false })
  createdAt: Date;

  static from(movie: Movie): MovieModel {
    const movieModel = new MovieModel();
    movieModel.movieId = movie.movieId;
    movieModel.title = movie.title;
    movieModel.description = movie.description;
    movieModel.category = movie.category;
    movieModel.genre = movie.genre;
    movieModel.releaseDate = movie.releaseDate;
    movieModel.createdAt = movie.createdAt;
    return movieModel;
  }
}
