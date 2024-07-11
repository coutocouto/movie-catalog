import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import {
  IMovieRepository,
  MovieSearchParams,
  MovieSearchResult,
} from "../../../domain/movie/movie.repository";
import { Movie } from "../../../domain/movie/movie.entity";
import { MovieModel } from "./movie.model";
import { MovieModelMapper } from "./movie-model.mapper";

@Injectable()
export class MovieTypeOrmRepository implements IMovieRepository {
  constructor(
    @InjectRepository(MovieModel)
    private movieModelRepository: Repository<MovieModel>,
  ) {}

  sortableFields: string[] = [
    "title",
    "category",
    "genre",
    "releaseDate",
    "createdAt",
  ];

  async create(entity: Movie): Promise<Movie> {
    const model = MovieModelMapper.toModel(entity);
    await this.movieModelRepository.save(model);
    return MovieModelMapper.toEntity(model);
  }

  async update(entity: Movie): Promise<Movie> {
    const { movieId, ...rest } = MovieModelMapper.toModel(entity);
    await this.movieModelRepository.update(movieId, rest);
    const updatedMovie = await this.movieModelRepository.findOne({
      where: { movieId },
    });
    return MovieModelMapper.toEntity(updatedMovie);
  }

  async delete(id: string): Promise<void> {
    await this.movieModelRepository.delete({ movieId: id });
  }

  async findById(id: string): Promise<Movie> {
    const model = await this.movieModelRepository.findOne({
      where: { movieId: id },
    });
    return model ? MovieModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<Movie[]> {
    return await this.movieModelRepository
      .find()
      .then((models) =>
        models.map((model) => MovieModelMapper.toEntity(model)),
      );
  }

  async existsByTitle(title: string) {
    return await this.movieModelRepository.existsBy({ title });
  }

  async search(props: MovieSearchParams): Promise<MovieSearchResult> {
    const { page, perPage, orderBy, orderDirection, filter } = props;

    const offset = (page - 1) * perPage;
    const limit = perPage;
    const [movies, moviesCount] = await this.movieModelRepository.findAndCount({
      where: [
        { title: filter ? ILike(`%${filter}%`) : undefined },
        { description: filter ? ILike(`%${filter}%`) : undefined },
      ],
      order:
        orderBy && this.sortableFields.includes(orderBy)
          ? { [orderBy]: orderDirection.toUpperCase() }
          : { createdAt: "DESC" },
      skip: offset,
      take: limit,
    });

    return new MovieSearchResult({
      items: movies.map((model) => MovieModelMapper.toEntity(model)),
      total: moviesCount,
      currentPage: page,
      perPage: perPage,
    });
  }

  async clear() {
    await this.movieModelRepository.clear();
  }
}
