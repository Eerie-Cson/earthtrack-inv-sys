import { ObjectId } from './object-id';
import { ObjectType } from './object-type';
import * as R from 'ramda';

describe('ObjectId', () => {
  describe('instantation', () => {
    test.concurrent(
      'should return an object with value key, when no argument given',
      () => {
        const id = new ObjectId();

        expect(id).toBeInstanceOf(Object);
        expect(id).toHaveProperty('value');
      }
    );
  });

  describe('#toString', () => {
    test.concurrent('should generate a valid ObjectId with type prefix', () => {
      const id = ObjectId.generate(ObjectType.ACCOUNT);
      const str = id.toString();

      expect(str.startsWith('acc_')).toBe(true);
      expect(id.type).toBe(ObjectType.ACCOUNT);
      expect(id).toBeInstanceOf(Object);
    });
  });

  describe('#toBuffer', () => {
    test.concurrent('should generate a valid ObjectId with type prefix', () => {
      const id = ObjectId.generate(ObjectType.ACCOUNT);
      const buffer = id.toBuffer();

      expect(buffer).toBeInstanceOf(Buffer);
      expect(id.type).toBe(ObjectType.ACCOUNT);
      expect(id).toBeInstanceOf(Object);
    });
  });

  describe('#from', () => {
    test.concurrent(
      'should correctly return the type from string to buffer',
      () => {
        const accountId = ObjectId.generate(ObjectType.ACCOUNT).toString();
        const buffer = ObjectId.from(accountId).toBuffer();

        expect(buffer).toBeInstanceOf(Buffer);
      }
    );
  });

  describe('#generate', () => {
    test.concurrent('should generate different ObjectIds each time', () => {
      const count = 1000;
      const types = [ObjectType.ACCOUNT, ObjectType.PRODUCT];

      const ids = types.map((type) =>
        R.times(() => ObjectId.generate(type).toString())(count)
      );

      ids.forEach((i) => {
        expect(R.uniq(i)).toHaveLength(count);
      });
    });
  });
});
