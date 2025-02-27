import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { InternalServerErrorHandler } from '@application/errors/internal-server-error.error';  

@Catch(InternalServerErrorHandler)  
export class InternalServerErrorHandlerFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorHandler, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    
    response.status(status).json({
      statusCode: status,
      code: exception['code'] || 'INTERNAL_SERVER_ERROR',  
      message: exception.message,
    });
  }
}
