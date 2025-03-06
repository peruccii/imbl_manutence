import { ConfigService } from '@nestjs/config';
import * as multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import * as path from 'path';
import { randomUUID } from 'crypto';

export const multerOptionsFactory = {
  useFactory: (configService: ConfigService) => {
    const s3Config = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
      },
    });

    return {
      storage: multerS3({
        s3: s3Config,
        bucket: 'imbl-manutence-bucket',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
          const fileName = `${path.parse(file.originalname).name.replace(/\s/g, '')}-${randomUUID()}`;
          const extension = path.parse(file.originalname).ext;
          cb(null, `${fileName}${extension}`);
        },
      }),
    };
  },
  inject: [ConfigService],
};