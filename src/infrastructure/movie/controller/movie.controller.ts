import { CreateMovieUseCase } from "./../../../application/movie/use-cases/create-movie/create-movie.usecase";
import { Controller, Post, Body } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateMovieInput } from "../../../application/movie/use-cases/create-movie/create-movie.input";
import { MovieOutput } from "../../../application/movie/use-cases/common/movie.output";

@Controller("movies")
export class MovieController {
  constructor(private readonly createMovieUseCase: CreateMovieUseCase) {}

  @ApiOperation({ summary: "Movie create" })
  @ApiResponse({
    status: 200,
    description: "Movie successfully created",
    type: MovieOutput,
  })
  @ApiResponse({ status: 404, description: "Movie already exists" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @Post()
  create(@Body() createMovieInput: CreateMovieInput) {
    console.log(
      "🚀 ~ MovieController ~ create ~ createMovieInput:",
      createMovieInput,
    );
    return this.createMovieUseCase.execute(createMovieInput);
  }
}
