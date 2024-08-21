import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';
import { ResponseCodes, ResponseFormat } from 'src/shared';
import AppError from './AppError';
import AppValidationError from './AppValidationError';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof AppError) {
      ResponseFormat.handleAppErrorResponse(
        response,
        exception.responseCode,
        exception.httpStatus(),
        exception.message,
      );
    } else if (exception instanceof AppValidationError) {
      ResponseFormat.sendResponse(
        response,
        ResponseCodes['0002'],
        undefined,
        exception.message,
        400,
      );
    } else if (exception instanceof AxiosError) {
      ResponseFormat.handleAppErrorResponse(response, '0002', 400);
    } else if (exception instanceof NotFoundException) {
      ResponseFormat.handleAppErrorResponse(response, '0001', 404);
    } else if (exception.name === 'CastError') {
      ResponseFormat.handleAppErrorResponse(response, '0002', 400);
    } else {
      ResponseFormat.handleAppErrorResponse(response, '0002', 400);
    }
  }
}
