/* eslint-disable @typescript-eslint/no-unused-vars */
import { Movie } from "./movie.entity";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

type PropOrFactory<T> = T | ((index: number) => T);

export class MovieFakeBuilder<TBuild = any> {
  private _movieId: PropOrFactory<string> | undefined = undefined;
  private _title: PropOrFactory<string> = (_) => faker.company.catchPhrase();
  private _description: PropOrFactory<string> = (_) => faker.lorem.paragraph();
  private _category: PropOrFactory<string> = (_) => faker.music.genre();
  private _genre: PropOrFactory<string> = (_) => faker.music.genre();
  private _releaseDate: PropOrFactory<Date> = (_) => faker.date.anytime();
  private _createdAt: PropOrFactory<Date> | undefined = undefined;

  private countObjs: number;

  static aMovie() {
    return new MovieFakeBuilder<Movie>();
  }

  static theMovies(countObjs: number) {
    return new MovieFakeBuilder<Movie[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
  }

  withMovieId(valueOrFactory: PropOrFactory<string>) {
    this._movieId = valueOrFactory;
    return this;
  }

  withTitle(valueOrFactory: PropOrFactory<string>) {
    this._title = valueOrFactory;
    return this;
  }

  withDescription(valueOrFactory: PropOrFactory<string>) {
    this._description = valueOrFactory;
    return this;
  }

  withCategory(valueOrFactory: PropOrFactory<string>) {
    this._category = valueOrFactory;
    return this;
  }

  withGenre(valueOrFactory: PropOrFactory<string>) {
    this._genre = valueOrFactory;
    return this;
  }

  withReleaseDate(valueOrFactory: PropOrFactory<Date>) {
    this._releaseDate = valueOrFactory;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._createdAt = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const movies = new Array(this.countObjs).fill(undefined).map((_, index) => {
      const movie = new Movie({
        movieId: this.callFactory(this._movieId, index) || uuidv4(),
        title: this.callFactory(this._title, index),
        description: this.callFactory(this._description, index),
        category: this.callFactory(this._category, index),
        genre: this.callFactory(this._genre, index),
        releaseDate: this.callFactory(this._releaseDate, index),
        createdAt: this.callFactory(this._createdAt, index) || new Date(),
      });
      movie.validate();
      return movie;
    });
    return this.countObjs === 1 ? (movies[0] as any) : movies;
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function"
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
