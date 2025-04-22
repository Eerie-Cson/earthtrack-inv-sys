import { ObjectId, ObjectType } from '@lib/object-id';
import {
  deserializeItem,
  normalizeFilter,
  serializeDeep,
} from './mongoose-repository';
import { Binary } from 'mongodb';
import { faker } from '@faker-js/faker/.';

describe('MongoseRepository', () => {
  const accountId = ObjectId.generate(ObjectType.ACCOUNT);
  const buffer = accountId.toBuffer();

  describe('serializeDeep', () => {
    test.concurrent('serializes ObjectId', () => {
      expect(serializeDeep(accountId)).toEqual(buffer);
    });

    test.concurrent('serializes nested ObjectIds', () => {
      const obj = { nested: { userId: accountId } };
      const result = serializeDeep(obj);
      expect(result.nested.userId).toEqual(buffer);
    });

    test.concurrent('serializes ObjectIds in arrays', () => {
      const newId = ObjectId.generate(ObjectType.ACCOUNT);
      const obj = { ids: [accountId, newId] };
      const result = serializeDeep(obj);
      expect(result.ids).toEqual([buffer, newId.toBuffer()]);
    });

    test.concurrent('passes through null and primitives', () => {
      expect(serializeDeep(null)).toBeNull();
      expect(serializeDeep(42)).toBe(42);
      expect(serializeDeep('text')).toBe('text');
    });
  });

  describe('normalizeFilter', () => {
    test.concurrent('converts ObjectId to {_id: Buffer}', () => {
      expect(normalizeFilter(accountId)).toEqual({ _id: buffer });
    });

    test.concurrent('normalizes nested filters with ObjectId', () => {
      const filter = {
        user: { $in: [accountId] },
      };
      const normalized = normalizeFilter(filter);
      expect(normalized.user.$in[0]).toEqual(buffer);
    });

    test.concurrent('returns empty object for falsy filter', () => {
      expect(normalizeFilter(null)).toEqual({});
      expect(normalizeFilter(undefined)).toEqual({});
    });
  });

  describe('deserializeItem', () => {
    it('deserializes Buffer into ObjectId', () => {
      const result = deserializeItem(buffer);
      expect(result).toBeInstanceOf(ObjectId);
      expect(result.toBuffer()).toEqual(buffer);
    });

    it('deserializes Binary into ObjectId', () => {
      const binary = new Binary(buffer);
      const result = deserializeItem(binary);
      expect(result).toBeInstanceOf(ObjectId);
      expect(result.toBuffer()).toEqual(buffer);
    });

    it('deserializes object with _id into id', () => {
      const doc = {
        _id: buffer,
        name: faker.person.fullName(),
        __v: 0,
      };
      const result = deserializeItem(doc);
      expect(result.id).toBeInstanceOf(ObjectId);
      expect(result.name).toBe(doc.name);
      expect(result.__v).toBeUndefined();
    });

    it('passes through primitives and null unchanged', () => {
      expect(deserializeItem(null)).toBeNull();
      expect(deserializeItem('hello')).toBe('hello');
      expect(deserializeItem(123)).toBe(123);
    });
  });
});
