import { ObjectId } from '@lib/object-id';
export function normalizeDocument<T extends { id: ObjectId }>(
  doc: T
): Omit<T, 'id'> & { id: string } {
  return { ...doc, id: doc.id.toString() };
}
