import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  constructor() {}

  @Post()
  create(@Body() createUserDto: any) {
    return null;
  }

  @Get()
  findAll() {
    return null;
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return null;
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: any) {
    return null;
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return null;
  }
}
