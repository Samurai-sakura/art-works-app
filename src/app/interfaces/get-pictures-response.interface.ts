import { Config } from './config.interface';
import { PictureInterface } from './data.interface';
import { Pagination } from './pagination.interface';

export interface GetArtworksResponse {
  pagination: Pagination;
  data: PictureInterface[];
  info: {
    license_text: string;
    license_links: string[];
    version: string;
  };
  config: Config;
}
