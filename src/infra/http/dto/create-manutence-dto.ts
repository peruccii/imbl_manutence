import type { p } from '@application/interfaces/photos';

export class ManutenceCreateDto {
  message: string;
  photos: p[];
  video: string;
  userId: string;
}
