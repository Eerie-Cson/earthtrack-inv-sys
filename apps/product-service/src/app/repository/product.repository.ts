import { Connection, Schema } from 'mongoose';
import { MongooseRepository, Repository } from '@lib/repository';
import { Product } from '@lib/types';

export type ProductRepository = Repository<Product>;

export function ProductRepositoryFactory(connection: Connection) {
  const schema = new Schema({
    _id: {
      type: Buffer,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    dateTimeCreated: {
      type: Date,
      default: () => new Date(),
    },
    dateTimeLastUpdated: {
      type: Date,
      default: () => new Date(),
    },
  });

  schema.index({ id: 1 }, { unique: true });

  return new MongooseRepository<Product>(connection, 'Product', schema);
}
