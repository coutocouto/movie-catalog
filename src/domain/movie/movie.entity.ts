import { BaseEntity } from "../../shared/domain/base.entity";
import { v4 as uuidv4 } from "uuid";
import { MovieValidatorFactory } from "./movie.validator";

type MovieConstructorProps = {
  movieId?: string;
  title: string;
  description: string;
  category: string;
  genre: string;
  releaseDate: Date;
  createdAt?: Date;
};

type MovieCreateProps = {
  title: string;
  description: string;
  category: string;
  genre: string;
  releaseDate: Date;
};

export class Movie extends BaseEntity {
  movieId: string;
  title: string;
  description?: string | null;
  category: string;
  genre: string;
  releaseDate: Date;
  createdAt: Date;

  constructor(props: MovieConstructorProps) {
    super();
    this.movieId = props.movieId || uuidv4();
    this.title = props.title;
    this.description = props.description;
    this.category = props.category;
    this.genre = props.genre;
    this.releaseDate = props.releaseDate;
    this.createdAt = props.createdAt || new Date();
  }

  get entityId(): string {
    return this.movieId;
  }

  static create(props: MovieCreateProps): Movie {
    const movie = new Movie({
      title: props.title,
      description: props.description,
      category: props.category,
      genre: props.genre,
      releaseDate: props.releaseDate,
    });
    movie.validate();
    return movie;
  }

  static from(props: MovieConstructorProps): Movie {
    return new Movie(props);
  }

  validate(fields?: string[]) {
    const validator = MovieValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  changeTitle(title: string) {
    this.title = title;
    this.validate(["title"]);
  }

  changeDescription(description: string) {
    this.description = description;
  }

  changeCategory(category: string) {
    this.category = category;
  }

  changeGenre(genre: string) {
    this.genre = genre;
  }

  changeReleaseDate(releaseDate: Date) {
    this.releaseDate = new Date(releaseDate);
  }

  toJSON() {
    return {
      movieId: this.movieId,
      title: this.title,
      description: this.description,
      releaseDate: this.releaseDate,
      createdAt: this.createdAt,
    };
  }
}
