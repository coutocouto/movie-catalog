// src/shared/infrastructure/exception/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";
import { EntityNotFound } from "../../domain/exceptions/entity-not-found.exception";
import { InvalidPassword } from "../../domain/exceptions/invalid-password.exception";
import { EntityAlreadyExists } from "../../domain/exceptions/entity-already-exists.exception";
import { EntityValidationError } from "../../domain/validators/validation.error";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof EntityNotFound) {
      return response.status(404).json(this.formatResponse(404, exception));
    }

    if (exception instanceof InvalidPassword) {
      return response.status(401).json(this.formatResponse(401, exception));
    }

    if (exception instanceof EntityAlreadyExists) {
      return response.status(409).json(this.formatResponse(409, exception));
    }

    if (exception instanceof BadRequestException) {
      const status = exception.getStatus();
      const responsePayload = exception.getResponse();
      const errors = responsePayload;
      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: "Validation failed",
        errors: errors,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return response
        .status(status)
        .json(this.formatResponse(status, exception));
    }

    if (exception instanceof EntityValidationError) {
      return response.status(400).json({
        statusCode: 400,
        timestamp: new Date().toISOString(),
        path: request.url,
        errors: exception.error,
      });
    }

    return response.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: "Internal Server Error",
    });
  }

  private formatResponse(status: number, exception: any) {
    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    };
  }
}
