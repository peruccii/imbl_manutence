export interface CreateManutenceRequest {
  message: string;
  photos: {
    fileName: string;
    signedUrl: string;
  }[];
  video: string;
  title: string;
  address: string;
  userId: string;
}
