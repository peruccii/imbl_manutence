import { Manutence } from '../entities/manutence';
import { StatusManutence } from '../enums/StatusManutence';
import { Message } from '../fieldsValidations/message';
import { CreateManutenceRequest } from '../interfaces/manutence-create-request';
import { SpecialtyItem } from '../entities/manutence';

type Override = CreateManutenceRequest;

export function makeManutenceFactory(override: Override) {
  return new Manutence({
    message: new Message(override.message),
    photos: override.photos,
    video: override.video,
    address: override.address,
    title: override.title.toUpperCase(),
    userId: override.userId,
    status_manutence: StatusManutence.NOVO,
    specialties: override.specialties
      ? override.specialties.map((specialty) => ({
          name: specialty,
        }))
      : [],
  });
}
