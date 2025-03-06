import type { p } from "./photos";

export interface CreateManutenceRequest {
  message: string;
  photos: p[];
  video: string;
  userId: string;
}
