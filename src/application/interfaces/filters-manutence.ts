import { StatusManutence } from '@application/enums/StatusManutence';

export interface FiltersManutence {
  status_manutence?: StatusManutence[];
  userId?: string;
}
