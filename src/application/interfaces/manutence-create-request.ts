import { User } from "../entities/user";

export interface CreateManutenceRequest {
  message: string;
  photos: string[];
  video: string;
  userId: string;
  client: User;
}
