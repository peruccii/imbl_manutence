import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  handleFileUpload(data: { photos: File[]; video: File }) {
    return data;
  }
}
