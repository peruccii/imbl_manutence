import { User } from 'src/application/entities/user';

export class ManutenceCreateDto {
  message: string;
  photos: string[];
  video: string;
  client: User;
}
