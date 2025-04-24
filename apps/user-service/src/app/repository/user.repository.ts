import { MongooseRepository, Repository } from '@lib/repository';
import { User } from '@lib/types';

import { Connection, Schema } from 'mongoose';

export type UserRepository = Repository<User>;

export function UserRepositoryFactory(connection: Connection) {
  const schema = new Schema({
    _id: {
      type: Buffer,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    role: {
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

  return new MongooseRepository<User>(connection, 'User', schema);
}
