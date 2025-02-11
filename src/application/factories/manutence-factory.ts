import { Manutence } from '../entities/manutence';
import { StatusManutence } from '../enums/StatusManutence';
import { Message } from '../fieldsValidations/message';
import { CreateManutenceRequest } from '../usecases/manutence-create-service';

type Override = CreateManutenceRequest;

export function makeManutenceFactory(override: Override) {
  return new Manutence({
    message: new Message(override.message),
    photos: override.photos,
    video: override.video,
    status_manutence: StatusManutence.CREATED,
    client: override.client,
  });
}
