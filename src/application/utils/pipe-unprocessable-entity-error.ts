import { UnprocessableEntityErrorHandler } from '@application/errors/already-exists';
import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch(UnprocessableEntityErrorHandler)  
export class UnprocessableEntityErrorHandlerFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityErrorHandler, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = HttpStatus.UNPROCESSABLE_ENTITY;
    
    response.status(status).json({
      statusCode: status,
      code: exception['code'] || 'UNPROCESSABLE_ENTITY_ERROR', 
      message: exception.message,
    });
  }
}
