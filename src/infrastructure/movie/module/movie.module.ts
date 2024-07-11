import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MovieController } from "../controller/movie.controller";
import { MovieModel } from "../repository/movie.model";
import { MOVIE_PROVIDERS } from "./movie.providers";
import { CustomCacheModule } from "../../../shared/infrastructure/services/cache/cache.module";

@Module({
  imports: [TypeOrmModule.forFeature([MovieModel]), CustomCacheModule],
  controllers: [MovieController],
  providers: [
    ...Object.values(MOVIE_PROVIDERS.REPOSITORIES),
    ...Object.values(MOVIE_PROVIDERS.USE_CASES),
    ...Object.values(MOVIE_PROVIDERS.SERVICES),
  ],
})
export class MovieModule {}
