//multer-config.ts
import * as multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import * as path from 'path';
import { randomUUID } from 'crypto';

const s3Config = new S3Client({
  region: 'sa-east-1', 
  credentials: {
    accessKeyId: 'AKIAXTVE2Q4BYHIUN6UY', 
    secretAccessKey: 'chave de acesso secreta', 
  },
});

const multerConfig = {
  storage: multerS3({
    s3: s3Config,
    bucket: 'imbl-manutence-s3',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      const fileName =
        path.parse(file.originalname).name.replace(/\s/g, '') + '-' + randomUUID(); // change to v4 uuid

      const extension = path.parse(file.originalname).ext;
      cb(null, `${fileName}${extension}`);
    },
  }),
};

export default multerConfig;
