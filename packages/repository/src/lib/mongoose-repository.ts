/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection, FilterQuery, Model, Schema } from 'mongoose';
import { Binary } from 'mongodb';
import { Repository } from './repository';
import { ObjectId } from '@lib/object-id';
import * as R from 'ramda';

export function serializeDeep(obj: any): any {
  if (obj instanceof ObjectId) return obj.toBuffer();
  if (Array.isArray(obj)) return obj.map(serializeDeep);
  if (obj?.constructor === Object) {
    return R.map(serializeDeep, obj);
  }
  return obj;
}

export function normalizeFilter(filter?: any) {
  if (!filter) return {};

  if (filter instanceof ObjectId) {
    return { _id: filter.toBuffer() };
  }

  return serializeDeep(filter);
}

export function deserializeItem(item: any): any {
  if (item === null) {
    return null;
  }

  if (Buffer.isBuffer(item)) {
    return new ObjectId(item);
  }

  if (item instanceof Binary) {
    const buffer = Buffer.from(item.buffer);
    return new ObjectId(buffer);
  }

  if (item?.constructor === Object) {
    const result: Record<string, any> = {};
    const props = Object.entries(R.omit(['__v'], item));

    for (const [field, value] of props) {
      let key = field;

      if (key === '_id') {
        key = 'id';
      }

      result[key] = deserializeItem(value);
    }

    return result;
  }
  return item;
}

export class MongooseRepository<TEntity extends { id: ObjectId }>
  implements Repository<TEntity>
{
  private readonly _model: Model<TEntity>;

  constructor(connection: Connection, name: string, schema: Schema) {
    this._model = connection.model<TEntity>(name, schema);
  }

  public async create(data: TEntity) {
    const doc = { ...data, _id: data.id.toBuffer() };
    await this._model.create(doc);
  }

  public async update(filter: FilterQuery<TEntity>, data: Partial<TEntity>) {
    await this._model.updateMany(normalizeFilter(filter), {
      $set: {
        ...serializeDeep(data),
        dateTimeLastUpdated: new Date(),
      },
    });
  }

  public async delete(filter: FilterQuery<TEntity>) {
    await this._model.deleteMany(normalizeFilter(filter));
  }

  public async find(filter?: FilterQuery<TEntity>) {
    const doc = await this._model.findOne(normalizeFilter(filter)).lean();
    if (!doc) return null;
    return deserializeItem(doc);
  }

  public async list(filter?: FilterQuery<TEntity>) {
    const docs = await this._model.find(normalizeFilter(filter)).lean();
    return docs.map(deserializeItem);
  }
}
