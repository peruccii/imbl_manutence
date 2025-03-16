import { FilesTypeInterface } from '@application/interfaces/files-type-interface';
import { UploadedFile } from '@application/interfaces/upload-file';
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface UploadResponse {
  photos: string[];
  video: string;
}

interface UploadedFilesObject {
  photos: string[];
  video: string;
}

@Injectable()
export class FileUploadService {
  private readonly bucketName: string;
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow('AWS_BUCKET_NAME');
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async handleFileUpload(data: FilesTypeInterface): Promise<UploadResponse> {
    const uploadedFiles: UploadedFilesObject = { photos: [], video: '' };

    if (!data.photos || data.photos.length === 0) {
      throw new BadRequestException('Pelo menos uma foto é obrigatória');
    }

    uploadedFiles.photos = await Promise.all(
      data.photos.map(async (photo) => {
        if (!photo.mimetype.startsWith('image/')) {
          throw new BadRequestException('As fotos devem ser imagens');
        }
        return this.uploadToS3(photo, 'photos');
      }),
    );

    if (data.video) {
      if (!data.video.mimetype.startsWith('video/')) {
        throw new BadRequestException('O vídeo deve ser um arquivo de vídeo');
      }
      uploadedFiles.video = await this.uploadToS3(data.video, 'videos');
    }

    return uploadedFiles;
  }

  private async uploadToS3(
    file: UploadedFile,
    folder: string,
  ): Promise<string> {
    const fileName = `${folder}/${file.originalname.replace(/\s/g, '')}-${randomUUID()}`;
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      return await this.getSignedUrl(fileName);
    } catch (error) {
      throw new BadRequestException(
        `Erro ao fazer upload do arquivo: ${error}`,
      );
    }
  }

  private async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    
    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async generateSignedUrls(urls: string | string[]): Promise<string[]> {
    const urlsArray = Array.isArray(urls) ? urls : [urls];
    
    return Promise.all(
      urlsArray.map(async (url) => {
        const urlParts = new URL(url);
        const key = urlParts.pathname.substring(1);
        return await this.getSignedUrl(key);
      }),
    );
  }

  async deleteFilesFromS3(urls: (string | string[])[]): Promise<any> {
    const urlsArray = Array.isArray(urls) ? urls : [urls];

    const keys = urlsArray.flat().map((url) => {
      const urlParts = new URL(url);
      const key = urlParts.pathname.substring(1);
      return key;
    });

    const deleteParams = {
      Bucket: this.bucketName,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    };
    try {
      const command = new DeleteObjectsCommand(deleteParams);
      const response = await this.s3Client.send(command);
      return response;
    } catch (error) {
      throw new Error('Erro ao deletar arquivos: ' + error);
    }
  }
}
