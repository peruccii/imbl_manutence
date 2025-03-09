import type { UploadedFile } from "./upload-file";

export interface FilesTypeInterface {
  photos: UploadedFile[];
  video: UploadedFile;
}
