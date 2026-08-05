export interface ApiErrorResponse {
  error?: string;
  detail?: string;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
