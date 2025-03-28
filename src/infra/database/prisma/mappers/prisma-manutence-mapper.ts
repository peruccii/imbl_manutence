import { Manutence as RawManutence } from '@prisma/client';
import { Manutence } from 'src/application/entities/manutence';
import { Message } from 'src/application/fieldsValidations/message';
import { StatusManutence } from 'src/application/enums/StatusManutence';
import { User } from '@application/entities/user';
import { Email } from '@application/fieldsValidations/email';
import { Name } from '@application/fieldsValidations/name';
import { Telefone } from '@application/fieldsValidations/telefone';
import { Role } from '@application/enums/role.enum';
import { Password } from '@application/fieldsValidations/password';

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
      chatRoom: manutence.chatRoomId ? {
        connect: { id: manutence.chatRoomId }
      } : undefined,
      admin: manutence.adminId ? {
        connect: { id: manutence.adminId }
      } : undefined,
    };
  }

  static toDomain(rawManutence: RawManutence & { user?: any }): Manutence {
    const manutence = new Manutence(
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
        adminId: rawManutence.adminId || undefined,
        chatRoomId: rawManutence.chatRoomId || undefined,
      },
      rawManutence.id,
    );

    if (rawManutence.user) {
      manutence.user = new User(
        {
          email: new Email(rawManutence.user.email),
          name: new Name(rawManutence.user.name),
          telephone: new Telefone(rawManutence.user.telephone),
          createdAt: rawManutence.user.createdAt,
          typeUser: rawManutence.user.typeUser as Role,
          manutences: [],
          password: new Password(rawManutence.user.password),
        },
        rawManutence.user.id,
      );
    }

    return manutence;
  }
}
