import { Manutence } from 'src/application/entities/manutence';

export class ManutenceViewModel {
  static toGetFormatHttp(manutence: Manutence) {
    const photos = manutence.photos;
    return {
      id: manutence.id,
      message: manutence.message.value,
      photos: photos,
      video: manutence.video,
      client: manutence.user,
      title: manutence.title,
      address: manutence.address,
      status_manutence: manutence.status_manutence,
      createdAt: manutence.createdAt,
    };
  }
}
