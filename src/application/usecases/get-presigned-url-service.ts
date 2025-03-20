import { Injectable } from '@nestjs/common';
import { FileUploadService } from './file-upload-service';
import { FilesTypeInterface } from '@application/interfaces/files-type-interface';
import type { UploadResponse } from '@application/interfaces/upload-response';

@Injectable()
export class GetPreSignedUrlService {
  constructor(private readonly fileUploadService: FileUploadService) {}

  async execute(fileObject: FilesTypeInterface): Promise<UploadResponse> {
    const uploadedFiles =
      await this.fileUploadService.handleFileUpload(fileObject);
    return uploadedFiles;
  }
}
