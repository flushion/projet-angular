import { IDimension } from './IDimension';

export interface IPhoto {
  name: string;
  createdAt: string;
  liked: boolean;
  size: number;
  dimensions: IDimension;
}
