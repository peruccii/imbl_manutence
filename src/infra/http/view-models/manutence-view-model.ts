import { Manutence } from "src/application/entities/manutence";

export class ManutenceViewModel {
  static toGetFormatHttp(manutence: Manutence) {
    return {
      id: manutence.id,
      message: manutence.message,
      photos: manutence.photos,
      video: manutence.video,
      client: manutence.client,
      status_manutence: manutence.status_manutence,
      createdAt: manutence.createdAt,
    };
  }
}