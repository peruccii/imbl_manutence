import { Manutence } from 'src/application/entities/manutence';

export class ManutenceViewModel {
  static toGetFormatHttp(manutence: Manutence) {
    const photos =
      Array.isArray(manutence.photos) && manutence.photos.length
        ? manutence.photos.map((photo) => ({
            fileName: photo.fileName,
            signedUrl:
              typeof photo.signedUrl === 'string' ? photo.signedUrl : '',
          }))
        : [];

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
