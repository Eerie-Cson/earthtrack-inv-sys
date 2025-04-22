import { ObjectId, ObjectType } from '@lib/object-id';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose, { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';
import { MongooseRepository } from '../lib/mongoose-repository';

type Product = {
  id: ObjectId;
  name: string;
  description?: string;
  category: string;
  price: number;
};

export async function setupFixture() {
  const mongo = await MongoMemoryReplSet.create({
    replSet: {
      storageEngine: 'wiredTiger',
    },
    instanceOpts: [
      {
        launchTimeout: 20000,
      },
    ],
  });

  const connection = await mongoose.createConnection(mongo.getUri());

  const repository = new MongooseRepository<Product>(
    connection,
    'Product',
    new Schema({
      _id: Buffer,
      name: String,
      description: String,
      category: String,
      price: Number,
    })
  );

  return {
    repository,
    teardown: async () => {
      await connection.close();
      await mongo.stop();
    },
  };
}

function generateProduct() {
  const id = ObjectId.generate(ObjectType.PRODUCT);
  return {
    id,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    price: Number(faker.commerce.price()),
  };
}

describe('MongooseRepository', () => {
  describe('#create', () => {
    test.concurrent('create item', async () => {
      const { repository, teardown } = await setupFixture();

      const product = generateProduct();

      await expect(repository.create(product)).resolves.toBeUndefined();

      await teardown();
    });
  });

  describe('#find', () => {
    test.concurrent('find item', async () => {
      const { repository, teardown } = await setupFixture();

      const product = generateProduct();

      await repository.create(product);

      await expect(repository.find(product.id)).resolves.toEqual(product);

      await teardown();
    });
  });

  describe('#list', () => {
    test.concurrent('list items', async () => {
      const { repository, teardown } = await setupFixture();

      const product1 = generateProduct();
      const product2 = generateProduct();

      await Promise.all([
        repository.create(product1),
        repository.create(product2),
      ]);

      await expect(repository.list()).resolves.toEqual([product1, product2]);

      await teardown();
    });
  });

  describe('#update', () => {
    test.concurrent('update item', async () => {
      const { repository, teardown } = await setupFixture();

      const product = generateProduct();

      await repository.create(product);

      await expect(
        repository.update(product.id, { name: 'new name' })
      ).resolves.toBeUndefined();

      await expect(repository.find(product.id)).resolves.toEqual({
        ...product,
        name: 'new name',
      });

      await teardown();
    });
  });

  describe('#delete', () => {
    test.concurrent('delete item', async () => {
      const { repository, teardown } = await setupFixture();

      const product = generateProduct();

      await repository.create(product);

      await expect(repository.delete(product.id)).resolves.toBeUndefined();

      await expect(repository.find(product.id)).resolves.toBeNull();

      await teardown();
    });
  });
});
