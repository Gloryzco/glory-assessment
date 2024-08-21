import { ResponseCodes } from './ResponseCodes';
import { HttpStatus } from '@nestjs/common';

class AppError extends Error {
  message: string;
  isOperational: boolean;
  responseCode: string;
  responseBody: any;
  httpStatusCode: HttpStatus;

  constructor(responseCode: string, message?: string, httpStatus?: HttpStatus) {
    super();

    this.isOperational = true;
    this.message = message ? message : ResponseCodes[responseCode].message;
    this.responseCode = responseCode;
    this.responseBody = ResponseCodes[responseCode];
    this.responseBody = ResponseCodes[responseCode];
    this.httpStatusCode = httpStatus;

    Error.captureStackTrace(this, this.constructor);
  }

  httpStatus() {
    switch (this.responseBody?.status) {
      case 'SUCCESS':
        if (this.responseBody.code == '00') {
          return this.httpStatusCode ?? 200;
        }
      case 'FAILED':
        return this.httpStatusCode ?? 400;

      default:
        return this.httpStatusCode ?? 500;
    }
  }
}

export default AppError;
