import { Manutence as RawManutence } from '@prisma/client';
import { Manutence } from 'src/application/entities/manutence';
import { Message } from 'src/application/fieldsValidations/message';
import { JsonValue } from '@prisma/client/runtime/library';
import { StatusManutence } from 'src/application/enums/StatusManutence';

function convertJsonValueToStringArray(value: JsonValue): string[] {
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return value as string[];
  }

  return [];
}

export class PrismaManutenceMapper {
  static toPrisma(manutence: Manutence) {
    return {
      id: manutence.id,
      message: manutence.message.value,
      photos: JSON.stringify(manutence.photos),
      video: manutence.video,
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
        photos: convertJsonValueToStringArray(rawManutence.photos),
        status_manutence: rawManutence.status_manutence as StatusManutence,
        video: rawManutence.video,
        userId: rawManutence.userId,
        createdAt: rawManutence.createdAt,
      },
      rawManutence.id,
    );
  }
}
