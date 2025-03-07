import { Injectable } from '@nestjs/common';
import {
  MulterFile,
  MulterFiles,
} from 'src/infra/http/MulterType/multer-type-default';
import {
  MulterFileS3,
  MulterFilesS3,
} from 'src/infra/http/MulterType/s3multer-type';

export interface FilesTypeInterface {
  photos: { photos: MulterFilesS3 | MulterFiles } ;
  video: MulterFileS3 | MulterFile;
}

@Injectable()
export class FileUploadService {
  handleFileUpload(data: FilesTypeInterface) {
    return data;
  }
}
