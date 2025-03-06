// import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
// import { Injectable } from '@nestjs/common';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import type { ConfigService } from '@nestjs/config';

// @Injectable()
// export class S3ServiceUseCase {
//   public s3Client: S3Client;
//   private bucketName = 'imbl-manutence-bucket';

//   constructor(private readonly configService: ConfigService) {
//     const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
//     const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
//     if (!accessKeyId || !secretAccessKey) {
//       throw new Error('AWS credentials are not configured in the environment.');
//     }
//     this.s3Client = new S3Client({
//       region: 'us-east-1',
//       credentials: {
//         accessKeyId,
//         secretAccessKey,
//       },
//     });
//   }
  
//   async getSignedUrl(fileKey: string): Promise<string> {
//     if (!fileKey) throw new Error('File key is required');
//     const command = new GetObjectCommand({
//       Bucket: this.bucketName,
//       Key: fileKey,
//     });

//     return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); 
//   }
// }