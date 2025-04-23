import { FilterQuery, Model, SortOrder } from 'mongoose';
import { PaginatedResponse, PaginateOptions } from './paginate.types';

export async function paginate<T>(
  model: Model<T>,
  filter: FilterQuery<T> = {},
  options: PaginateOptions<T>
): Promise<PaginatedResponse<T>> {
  const direction: SortOrder = options.sort === 'asc' ? 1 : -1;
  const operator = options.sort === 'asc' ? '$gt' : '$lt';
  const cursor = options.cursorField ?? 'cursor';
  const limit = options?.limit ?? 10;

  const cursorFilter = options.cursor
    ? { [cursor]: { [operator]: options.cursor } }
    : {};

  const query = model
    .find({ ...filter, ...cursorFilter })
    .sort({ [cursor]: direction })
    .limit(limit + 1);

  const docs = await query.exec();

  const hasNext = docs.length > limit;
  const paginatedDocs = hasNext ? docs.slice(0, options.limit) : docs;

  const nextCursor = hasNext
    ? (paginatedDocs[paginatedDocs.length - 1] as any)[cursor]
    : undefined;

  return {
    data: paginatedDocs.map((doc) => doc.toObject()),
    nextCursor: nextCursor,
  };
}
