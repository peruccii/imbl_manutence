import type { StatusManutence } from '@application/enums/StatusManutence';

export interface ManutenceHistoryObjectInterface {
  title: string;
  address: string;
  status_manutence: StatusManutence;
  createdAt: Date;
  message: string;
  photos: {
    fileName: string;
    signedUrl: string;
  }[];
}
