import { Manutence } from 'src/application/entities/manutence';

export class ManutenceViewModel {
  static toGetFormatHttp(manutence: Manutence) {
    const photos = manutence.photos;
    return {
      id: manutence.id,
      message: manutence.message.value,
      photos: photos,
      video: manutence.video,
      client: manutence.user
        ? {
            id: manutence.user.id,
            name: manutence.user.name.value,
            email: manutence.user.email.value,
          }
        : null,
      title: manutence.title,
      address: manutence.address,
      status_manutence: manutence.status_manutence,
      priority: manutence.priority,
      createdAt: manutence.createdAt,
      specialties: manutence.specialties,
    };
  }
}
