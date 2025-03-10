import { Injectable } from '@nestjs/common';
import { ManutenceRepository } from '../repositories/manutence-repository';
import { ManutenceNotFoundMessage } from '../messages/manutence-not-found';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';
import { FileUploadService } from './file-upload-service';

@Injectable()
export class DeleteManutenceService {
  constructor(
    private readonly s3Client: FileUploadService,
    private readonly manutenceRepository: ManutenceRepository,
  ) {}

  async execute(id: string) {
    const manutenceExists = await this.manutenceRepository.find(id);

    if (!manutenceExists) {
      const err = new NotFoundErrorHandler(ManutenceNotFoundMessage);
      err.error();
      return;
    }

    const photos = manutenceExists.photos;
    const video = manutenceExists.video;

    const arrayFiles = [photos, video];

    await this.s3Client.deleteFilesFromS3(arrayFiles);

    return this.manutenceRepository.delete(id);
  }
}
