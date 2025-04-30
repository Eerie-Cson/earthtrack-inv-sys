import * as R from 'ramda';
import { generateAccount } from './helpers/generate-account';
import { setupFixture } from './helpers/setup-fixture';

import * as grpc from '@grpc/grpc-js';
import { AccountRole } from '@lib/types';
import { Token } from '../app/libs/token';
import { UserRepository } from '../app/repository/user.repository';

describe('UserController.CreateUser (gRPC)', () => {
  test('should create a new user via gRPC', async () => {
    const { grpcClient, module, teardown } = await setupFixture();

    const userRepository = module.get<UserRepository>(Token.UserRepository);

    const user = generateAccount();

    const response = await new Promise((resolve, reject) => {
      grpcClient.CreateUser(
        R.omit(['id', 'role'], user),
        (err: grpc.ServiceError, res: any) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });

    const createdUser = await userRepository.find({
      username: user.username,
    });

    expect(response).toEqual({ data: true });
    expect(createdUser).toHaveProperty('id');
    expect(createdUser).toMatchObject({
      username: user.username,
      email: user.email,
      role: user.role,
    });

    await teardown();
  });
});
