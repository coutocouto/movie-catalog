import { Movie } from "../movie.entity";

describe("Movie entity unit test", () => {
  beforeEach(() => {
    Movie.prototype.validate = jest
      .fn()
      .mockImplementation(Movie.prototype.validate);
  });

  test("should create a movie entity", () => {
    const movie = new Movie({
      title: "The Godfather",
      description:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      category: "Crime",
      genre: "Drama",
      releaseDate: new Date("1972-03-24"),
    });

    expect(movie).toBeInstanceOf(Movie);
    expect(movie.movieId).toBeDefined();
    expect(movie.title).toBe("The Godfather");
    expect(movie.description).toBe(
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    );
    expect(movie.category).toBe("Crime");
    expect(movie.genre).toBe("Drama");
    expect(movie.releaseDate).toEqual(new Date("1972-03-24"));
    expect(movie.createdAt).toBeDefined();
    expect(movie.notification.hasErrors()).toBe(false);
  });

  test("should create a movie entity with custom movieId", () => {
    const movie = new Movie({
      movieId: "123",
      title: "The Godfather",
      description:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      category: "Crime",
      genre: "Drama",
      releaseDate: new Date("1972-03-24"),
    });

    expect(movie).toBeInstanceOf(Movie);
    expect(movie.movieId).toBe("123");
    expect(movie.title).toBe("The Godfather");
    expect(movie.description).toBe(
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    );
    expect(movie.category).toBe("Crime");
    expect(movie.genre).toBe("Drama");
    expect(movie.releaseDate).toEqual(new Date("1972-03-24"));
    expect(movie.createdAt).toBeDefined();
    expect(movie.notification.hasErrors()).toBe(false);
  });

  test("should create a movie entity with custom createdAt", () => {
    const movie = new Movie({
      title: "The Godfather",
      description:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      category: "Crime",
      genre: "Drama",
      releaseDate: new Date("1972-03-24"),
      createdAt: new Date("2021-01-01"),
    });

    expect(movie).toBeInstanceOf(Movie);
    expect(movie.createdAt).toEqual(new Date("2021-01-01"));
    expect(movie.movieId).toBeDefined();
    expect(movie.title).toBe("The Godfather");
    expect(movie.description).toBe(
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    );
    expect(movie.category).toBe("Crime");
    expect(movie.genre).toBe("Drama");
    expect(movie.releaseDate).toEqual(new Date("1972-03-24"));
    expect(movie.notification.hasErrors()).toBe(false);
  });

  test("should create a movie using a command", () => {
    const movie = Movie.create({
      title: "The Godfather",
      description:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      category: "Crime",
      genre: "Drama",
      releaseDate: new Date("1972-03-24"),
    });

    expect(movie).toBeInstanceOf(Movie);
    expect(movie.movieId).toBeDefined();
    expect(movie.title).toBe("The Godfather");
    expect(movie.description).toBe(
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    );
    expect(movie.category).toBe("Crime");
    expect(movie.genre).toBe("Drama");
    expect(movie.releaseDate).toEqual(new Date("1972-03-24"));
  });

  test("should change movie title and validate", () => {
    const movie = new Movie({
      title: "The Godfather",
      description:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      category: "Crime",
      genre: "Drama",
      releaseDate: new Date("1972-03-24"),
    });

    movie.changeTitle("The Godfather II");

    expect(movie.title).toBe("The Godfather II");
    expect(movie.validate).toHaveBeenCalledTimes(1);
  });
});
