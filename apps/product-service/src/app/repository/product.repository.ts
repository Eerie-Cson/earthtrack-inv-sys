import { Connection, Schema } from 'mongoose';
import { MongooseRepository, Repository } from '@lib/repository';
import { Product } from '@lib/types';
import * as crypto from 'crypto';

export type ProductRepository = Repository<Product>;

function hash(input: string | Buffer): Buffer {
  return crypto.createHash('sha256').update(input).digest();
}

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
    cursor: {
      type: Buffer,
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

  schema.pre('validate', function (next) {
    if (!this.cursor) {
      const dateTime = this.dateTimeCreated || new Date();
      const id = this._id;
      const timeBuffer = Buffer.alloc(6);
      timeBuffer.writeUIntBE(dateTime.getTime(), 0, 6);
      this.cursor = Buffer.concat([timeBuffer, hash(id).slice(0, 4)]);
    }
    next();
  });

  return new MongooseRepository<Product>(connection, 'Product', schema);
}
