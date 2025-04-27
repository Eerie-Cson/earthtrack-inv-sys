export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  role: string;
  email: string;
  firstname: string;
  lastname: string;
  dateTimeCreated: string;
  dateTimeLastUpdated: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export enum Category {
  TOOLBOX = 'TOOLBOX',
  BEVERAGES = 'BEVERAGES',
  ACCESSORIES = 'ACCESSORIES',
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: Category;
  price: number;
}

export interface ProductQueryParams {
  limit?: number;
  cursor?: string;
  sort?: 'asc' | 'desc';
  name?: string;
  description?: string;
  category?: Category;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    nextCursor?: string;
    prevCursor?: string;
    total: number;
  };
}

export interface Settings {
  recordsPerPage: number;
}
