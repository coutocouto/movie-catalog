import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MovieController } from "../controller/movie.controller";
import { MovieModel } from "../repository/movie.model";
import { MOVIE_PROVIDERS } from "./movie.providers";

@Module({
  imports: [TypeOrmModule.forFeature([MovieModel])],
  controllers: [MovieController],
  providers: [
    ...Object.values(MOVIE_PROVIDERS.REPOSITORIES),
    ...Object.values(MOVIE_PROVIDERS.USE_CASES),
  ],
})
export class MovieModule {}
