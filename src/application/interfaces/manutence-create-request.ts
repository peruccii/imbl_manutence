export interface CreateManutenceRequest {
  message: string;
  photos: {
    fileName: string;
    signedUrl: string;
  }[];
  video: {
    fileName: string;
    signedUrl: string;
  }[];
  title: string;
  address: string;
  userId: string;
}
