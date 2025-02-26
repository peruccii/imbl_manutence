import { Catch, ExceptionFilter, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { InternalServerErrorHandler } from '@application/errors/internal-server-error.error';  // Seu erro personalizado

@Catch(InternalServerErrorHandler)  // Especifique sua exceção personalizada
export class InternalServerErrorHandlerFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorHandler, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    
    response.status(status).json({
      statusCode: status,
      code: exception['code'] || 'INTERNAL_SERVER_ERROR',  // Personalize a estrutura conforme necessário
      message: exception.message,
    });
  }
}
