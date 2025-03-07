import { S3ServiceUseCase } from '@application/usecases/s3-service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [S3ServiceUseCase],
  exports: [S3ServiceUseCase],
})
export class S3Module {}
