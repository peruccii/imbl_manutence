import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  handleFileUpload(data: { photos: Express.MulterS3.File[]; video: Express.MulterS3.File }) {
    return data;
  }
}
