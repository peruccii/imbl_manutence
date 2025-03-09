import { Injectable } from '@nestjs/common';
import { makeManutenceFactory } from '../factories/manutence-factory';
import { UserNotFoundMessage } from '../messages/user-not-found';
import { UserRepository } from '../repositories/user-repository';
import { CreateManutenceRequest } from '../interfaces/manutence-create-request';
import { ManutenceRepository } from '@application/repositories/manutence-repository';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';
import { FilesTypeInterface } from '@application/interfaces/files-type-interface';
import { FileUploadService } from './file-upload-service';

@Injectable()
export class ManutenceCreateService {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly userRepository: UserRepository,
    private readonly manutenceRepository: ManutenceRepository,
  ) {}

  async execute(request_manutence: CreateManutenceRequest, fileObject: FilesTypeInterface) {
    const client = await this.userRepository.findOne(
      request_manutence.userId,
    );

    if (!client) {
      const err = new NotFoundErrorHandler(UserNotFoundMessage);
      err.error();
      return;
    }

    const uploadedFiles = await this.fileUploadService.handleFileUpload(fileObject);

    request_manutence.photos = uploadedFiles.photos;
    request_manutence.video = uploadedFiles.video;

    
    const manutence = makeManutenceFactory(request_manutence);
    return this.manutenceRepository.create(manutence);
  }
}
