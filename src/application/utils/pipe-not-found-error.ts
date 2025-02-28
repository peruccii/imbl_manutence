import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

@Catch(NotFoundErrorHandler)
export class NotFoundErrorErrorHandlerFilter implements ExceptionFilter {
  catch(exception: NotFoundErrorHandler, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = HttpStatus.NOT_FOUND;

    response.status(status).json({
      statusCode: status,
      code: exception['code'] || 'NOT_FOUND_ERROR',
      message: exception.message,
    });
  }
}
