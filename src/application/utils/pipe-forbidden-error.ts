import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ForbiddenErrorHandler } from '@application/errors/forbidden.error';

@Catch(ForbiddenErrorHandler)
export class ForbiddenErrorHandlerFilter implements ExceptionFilter {
  catch(exception: ForbiddenErrorHandler, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = HttpStatus.FORBIDDEN;

    response.status(status).json({
      statusCode: status,
      code: exception['code'] || 'FORBIDDEN_ERROR',
      message: 'YOU DONT HAVE AUTHORIZATION TO DO THIS.',
    });
  }
}
