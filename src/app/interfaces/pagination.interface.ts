export interface Pagination {
  total: number;
  limit: number;
  next_url: string;
  prev_url: string;
  current_page: number;
}
