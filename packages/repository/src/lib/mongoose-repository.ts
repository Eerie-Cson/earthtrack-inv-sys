/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from '@lib/object-id';
import { paginate, PaginatedResponse, PaginateOptions } from '@lib/pagination';
import { Logger } from '@nestjs/common';
import { Binary } from 'mongodb';
import { Connection, FilterQuery, Model, Schema } from 'mongoose';
import * as R from 'ramda';
import { Repository } from './repository';

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

      if (key.includes('cursor')) {
        result[key] = value;
      } else {
        result[key] = deserializeItem(value);
      }
    }

    return result;
  }
  return item;
}

export class MongooseRepository<TEntity extends { id: ObjectId }>
  implements Repository<TEntity>
{
  private readonly _model: Model<TEntity>;
  private readonly logger: Logger;

  constructor(connection: Connection, name: string, schema: Schema) {
    this._model = connection.model<TEntity>(name, schema);
    this.logger = new Logger(`${MongooseRepository.name}:${name}`);
  }

  public async create(data: TEntity) {
    this.logger.verbose(`Action: create`);
    try {
      const doc = { ...data, _id: data.id.toBuffer() };
      await this._model.create(doc);
      this.logger.log(`Params: ${JSON.stringify(data)}`);
    } catch (error) {
      this.logger.error(
        `Failed to create document with filter: ${JSON.stringify(data)}`,
        error
      );
      throw error;
    }
  }

  public async update(filter: FilterQuery<TEntity>, data: Partial<TEntity>) {
    this.logger.verbose(`Action: update`);

    try {
      await this._model.updateMany(normalizeFilter(filter), {
        $set: {
          ...serializeDeep(data),
          dateTimeLastUpdated: new Date(),
        },
      });
      this.logger.log(`Params: ${JSON.stringify({ filter, data })}`);
    } catch (error) {
      this.logger.error(
        `Failed to update document with filter: ${JSON.stringify({
          filter,
          data,
        })}`,
        error
      );
      throw error;
    }
  }

  public async delete(filter: FilterQuery<TEntity>) {
    this.logger.verbose('Action: delete');

    try {
      await this._model.deleteMany(normalizeFilter(filter));
      this.logger.log(`Params: ${JSON.stringify(filter)}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete document with filter: ${JSON.stringify(filter)}`,
        error
      );
      throw error;
    }
  }

  public async find(filter?: FilterQuery<TEntity>) {
    this.logger.verbose(`Action: find`);
    try {
      const doc = await this._model.findOne(normalizeFilter(filter)).lean();

      if (!doc) {
        this.logger.warn('No document found');
        return null;
      }

      const deserializedItem = deserializeItem(doc);
      this.logger.log(`Params: ${JSON.stringify(filter)}`);
      return deserializedItem;
    } catch (error) {
      this.logger.error(
        `Failed to delete document with filter: ${JSON.stringify(filter)}`,
        error
      );
      throw error;
    }
  }

  public async list(filter?: FilterQuery<TEntity>) {
    this.logger.verbose(`Listing documents with filter`);
    const docs = await this._model.find(normalizeFilter(filter)).lean();
    this.logger.verbose(`Found ${docs.length} documents`);
    return docs.map(deserializeItem);
  }

  public async paginateList(
    filter: FilterQuery<Partial<TEntity>> = {},
    options: PaginateOptions<TEntity>
  ): Promise<PaginatedResponse<TEntity>> {
    this.logger.verbose('Action: paginate');

    try {
      const result = await paginate(
        this._model,
        normalizeFilter(filter),
        options
      );

      this.logger.log(`Params: ${JSON.stringify({ filter, options })}`);

      return {
        ...result,
        data: result.data.map(deserializeItem),
      };
    } catch (error) {
      this.logger.error(
        `Failed to delete document with filter: ${JSON.stringify(filter)}`,
        error
      );
      throw error;
    }
  }
}
