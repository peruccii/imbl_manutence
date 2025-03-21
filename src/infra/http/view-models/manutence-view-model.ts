import { Manutence } from 'src/application/entities/manutence';

export class ManutenceViewModel {
  static toGetFormatHttp(manutence: Manutence) {
    return {
      id: manutence.id,
      message: manutence.message.value,
      photos: manutence.photos,
      video: manutence.video,
      client: manutence.user,
      title: manutence.title,
      address: manutence.address,
      status_manutence: manutence.status_manutence,
      createdAt: manutence.createdAt,
    };
  }
}
