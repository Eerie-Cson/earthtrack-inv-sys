import { ObjectId } from '@lib/object-id';
import { PaginateOptions, PaginatedResponse } from '@lib/paginate';
import { FilterQuery } from 'mongoose';

export interface Repository<T extends { id: ObjectId }> {
  create(data: T): Promise<void>;
  update(
    filter: ObjectId | FilterQuery<T>,
    data: Partial<Omit<T, 'id'>>
  ): Promise<void>;
  delete(filter: ObjectId | FilterQuery<T>): Promise<void>;
  find(filter?: ObjectId | FilterQuery<T>): Promise<T | null>;
  list(filter?: ObjectId | FilterQuery<T>): Promise<T[] | [] | null>;
  paginateList(
    filter: FilterQuery<T>,
    pagination: PaginateOptions<Partial<T>>
  ): Promise<PaginatedResponse<T>>;
}
