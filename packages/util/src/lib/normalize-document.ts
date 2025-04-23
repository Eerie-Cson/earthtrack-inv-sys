import { ObjectId } from '@lib/object-id';
export function normalizeDocument<T extends { id: ObjectId }>(
  doc: T & { cursor?: Buffer }
): Omit<T, 'id'> & { id: string; cursor?: string | Buffer } {
  const rawCursor = doc.cursor;

  return {
    ...doc,
    ...(rawCursor ? { cursor: rawCursor.toString('base64') } : {}),
    id: doc.id.toString(),
  };
}
