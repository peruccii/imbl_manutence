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

export interface PresignedUrlResponse {
  photos: { fileName: string; signedUrl: string }[];
  video: { fileName: string; signedUrl: string } | null;
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

  LIMIT_CONCURRENCY = 5;

  limitConcurrency = async <T>(
    items: T[],
    fn: (item: T) => Promise<any>,
    limit: number = this.LIMIT_CONCURRENCY,
  ) => {
    const results: any[] = [];
    const queue: Promise<any>[] = [];

    for (const item of items) {
      const promise = fn(item).then((result) => results.push(result));
      queue.push(promise);

      if (queue.length >= limit) {
        await Promise.race(queue);
        queue.splice(
          queue.findIndex((p) => p === promise),
          1,
        );
      }
    }

    await Promise.all(queue);
    return results;
  };

  async generatePutSignedUrls(files: {
    photos?: Express.Multer.File[];
    video?: Express.Multer.File[];
  }): Promise<{
    photos: { fileName: string; signedUrl: string }[];
    video: { fileName: string; signedUrl: string }[];
  }> {
    const photoUrls: { fileName: string; signedUrl: string }[] = [];
    const videoUrls: { fileName: string; signedUrl: string }[] = [];

    if (files.photos && files.photos.length > 0) {
      for (const photo of files.photos) {
        const sanitizedOriginalName = photo.originalname.replace(/\s+/g, '-');
        const key = `photos/${Date.now()}-${sanitizedOriginalName}`;
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          ContentType: photo.mimetype,
        });
        const signedUrl = await getSignedUrl(this.s3Client, command, {
          expiresIn: 300,
        });
        photoUrls.push({ fileName: key, signedUrl });
      }
    }

    if (files.video && files.video.length > 0) {
      for (const video of files.video) {
        const sanitizedOriginalName = video.originalname.replace(/\s+/g, '-');
        const key = `videos/${Date.now()}-${sanitizedOriginalName}`;
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          ContentType: video.mimetype,
        });
        const signedUrl = await getSignedUrl(this.s3Client, command, {
          expiresIn: 300,
        });
        videoUrls.push({ fileName: key, signedUrl });
      }
    }

    return { photos: photoUrls, video: videoUrls };
  }

  public async handleFileUpload(
    data: FilesTypeInterface,
  ): Promise<UploadResponse> {
    const uploadedFiles: UploadedFilesObject = { photos: [], video: '' };

    if (!data.photos || data.photos.length === 0) {
      throw new BadRequestException('Pelo menos uma foto é obrigatória');
    }

    uploadedFiles.photos = await this.limitConcurrency(
      data.photos,
      async (photo) => {
        if (!photo.mimetype.startsWith('image/')) {
          throw new BadRequestException('As fotos devem ser imagens');
        }
        return this.uploadToS3(photo, 'photos');
      },
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
      const url = await this.putSignedUrl(fileName);
      return url;
    } catch (error) {
      throw new BadRequestException(
        `Erro ao fazer upload do arquivo: ${error}`,
      );
    }
  }
  private async putSignedUrl(key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async getGenerateSignedUrls(urls: string | string[]): Promise<string[]> {
    const urlsArray = Array.isArray(urls) ? urls : [urls];

    return Promise.all(
      urlsArray.map(async (url) => {
        const urlParts = new URL(url);
        const key = urlParts.pathname.substring(1);
        return await this.putSignedUrl(key);
      }),
    );
  }

  async generateGetSignedUrls(
    fileNames: string[],
  ): Promise<{ fileName: string; signedUrl: string }[]> {
    const getUrls = await Promise.all(
      fileNames.map(async (fileName) => {
        const command = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
        });

        const signedUrl = await getSignedUrl(this.s3Client, command, {
          expiresIn: 3600,
        });
        return { fileName, signedUrl };
      }),
    );

    return getUrls;
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

  async deleteFilesFromS3ByFilenames(filenames: string[]): Promise<void> {
    try {
      const deleteParams = {
        Bucket: this.bucketName,
        Delete: {
          Objects: filenames.map((filename) => ({ Key: filename })),
        },
      };

      const command = new DeleteObjectsCommand(deleteParams);
      const response = await this.s3Client.send(command);

      if (response.Errors && response.Errors.length > 0) {
        console.error('Erros ao deletar arquivos:', response.Errors);
        throw new Error('Alguns arquivos não puderam ser deletados');
      }

      console.log('Arquivos deletados com sucesso:', response.Deleted);
    } catch (error) {
      console.error('Erro ao deletar arquivos:', error);
      throw new Error('Erro ao deletar arquivos do S3');
    }
  }
}
