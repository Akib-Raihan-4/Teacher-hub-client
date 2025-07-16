export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T;
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
    hasNextPage: boolean;
  };
}
