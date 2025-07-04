import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { InternalServerErrorHandlerFilter } from '@application/utils/pipe-internal-server-error';
import { NotFoundErrorErrorHandlerFilter } from '@application/utils/pipe-not-found-error';
import { UnprocessableEntityErrorHandlerFilter } from '@application/utils/pipe-unprocessable-entity-error';
import { ForbiddenErrorHandlerFilter } from '@application/utils/pipe-forbidden-error';
import { ValidationErrorFilter } from '@application/utils/pipe-validation-error';
import { BadRequestErrorHandlerFilter } from '@application/utils/pipe-bad-request-error';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    bodyParser: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new InternalServerErrorHandlerFilter());
  app.useGlobalFilters(new NotFoundErrorErrorHandlerFilter());
  app.useGlobalFilters(new UnprocessableEntityErrorHandlerFilter());
  app.useGlobalFilters(new ForbiddenErrorHandlerFilter());
  app.useGlobalFilters(new ValidationErrorFilter());
  app.useGlobalFilters(new BadRequestErrorHandlerFilter());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  
  app.useBodyParser('json', { limit: '50mb' });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
