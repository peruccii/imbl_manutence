import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { BadRequestErrorHandler } from '@application/errors/bad-request-error.error';

@Catch(BadRequestErrorHandler)
export class BadRequestErrorHandlerFilter implements ExceptionFilter {
  catch(exception: BadRequestErrorHandler, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      code: exception['code'] || 'BAD_REQUEST',
      message: exception.getMessages(),
    });
  }
}
