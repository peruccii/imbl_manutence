import { Manutence as RawManutence } from '@prisma/client';
import { Manutence } from 'src/application/entities/manutence';
import { Message } from 'src/application/fieldsValidations/message';
import { StatusManutence } from 'src/application/enums/StatusManutence';

export class PrismaManutenceMapper {
  static toPrisma(manutence: Manutence) {
    return {
      id: manutence.id,
      message: manutence.message.value,
      photos: manutence.photos.length
        ? manutence.photos.map((photo) => ({
            fileName: photo.fileName,
            signedUrl: photo.signedUrl,
          }))
        : [],
      video: manutence.video,
      address: manutence.address,
      title: manutence.title,
      status_manutence: manutence.status_manutence,
      createdAt: manutence.createdAt,
      user: {
        connect: { id: manutence.userId },
      },
    };
  }
  static toDomain(rawManutence: RawManutence): Manutence {
    return new Manutence(
      {
        message: new Message(rawManutence.message),
        photos:
          Array.isArray(rawManutence.photos) && rawManutence.photos.length
            ? rawManutence.photos.map((photo) => {
                const fileName =
                  photo &&
                  typeof photo === 'object' &&
                  'fileName' in photo &&
                  typeof photo.fileName === 'string'
                    ? photo.fileName
                    : '';
                const signedUrl =
                  photo &&
                  typeof photo === 'object' &&
                  'signedUrl' in photo &&
                  typeof photo.signedUrl === 'string'
                    ? photo.signedUrl
                    : '';
                return { fileName, signedUrl };
              })
            : [],
        status_manutence: rawManutence.status_manutence as StatusManutence,
        video: rawManutence.video,
        title: rawManutence.title,
        address: rawManutence.address,
        userId: rawManutence.userId,
        createdAt: rawManutence.createdAt,
      },
      rawManutence.id,
    );
  }
}
