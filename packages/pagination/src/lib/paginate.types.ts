export type PaginatedResponse<T> = { data: T[]; nextCursor?: Buffer };

export type PaginateOptions<T> = {
  limit?: number;
  sort?: 'asc' | 'desc';
  cursor?: Buffer;
  cursorField?: keyof T;
};
