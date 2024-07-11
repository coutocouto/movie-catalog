import { CreateMovieUseCase } from "./../../../application/movie/use-cases/create-movie/create-movie.usecase";
import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  HttpCode,
  Delete,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateMovieInput } from "../../../application/movie/use-cases/create-movie/create-movie.input";
import { MovieOutput } from "../../../application/movie/use-cases/common/movie.output";
import { UpdateMovieInput } from "../../../application/movie/use-cases/update-movie/update-movie.input";
import { UpdateMovieUseCase } from "../../../application/movie/use-cases/update-movie/update-movie.usecase";
import { FindMovieUseCase } from "../../../application/movie/use-cases/find-movie/find-movie.usecase";
import { DeleteMovieUseCase } from "../../../application/movie/use-cases/delete-movie/delete-movie.usecase";
import {
  ListMovieInput,
  ListMovieUseCase,
} from "../../../application/movie/use-cases/list-movie/list-movie.usecase";
@ApiTags("movies")
@Controller("movies")
export class MovieController {
  constructor(
    private readonly createMovieUseCase: CreateMovieUseCase,
    private readonly updateMovieUseCase: UpdateMovieUseCase,
    private readonly findMovieUseCase: FindMovieUseCase,
    private readonly deleteMovieUseCase: DeleteMovieUseCase,
    private readonly listMovieUseCase: ListMovieUseCase,
  ) {}

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
    return this.createMovieUseCase.execute(createMovieInput);
  }

  @ApiOperation({ summary: "Movie update" })
  @ApiResponse({
    status: 200,
    description: "Movie successfully updated",
    type: MovieOutput,
  })
  @ApiResponse({ status: 404, description: "Movie not found" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateMovieInput: UpdateMovieInput) {
    return this.updateMovieUseCase.execute({
      ...updateMovieInput,
      id,
    });
  }

  @ApiOperation({ summary: "Movie find" })
  @ApiResponse({
    status: 200,
    description: "Movie successfully found",
    type: MovieOutput,
  })
  @ApiResponse({ status: 404, description: "Movie not found" })
  @Get(":id")
  find(@Param("id") id: string) {
    return this.findMovieUseCase.execute({ id });
  }

  @HttpCode(204)
  @ApiOperation({ summary: "Movie delete" })
  @ApiResponse({ status: 204, description: "Movie successfully deleted" })
  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.deleteMovieUseCase.execute({ id });
  }

  @ApiOperation({ summary: "Movie list" })
  @ApiResponse({
    status: 200,
    description: "Movies successfully listed",
    type: [MovieOutput],
  })
  @Get()
  list(@Query() searchParamsDto: ListMovieInput) {
    return this.listMovieUseCase.execute(searchParamsDto);
  }
}
