import * as grpc from '@grpc/grpc-js';
import bcrypt from 'bcrypt';
import { Token } from '../app/libs/token';
import { UserRepository } from '../app/repository/user.repository';
import { generateAccount } from './helpers/generate-account';
import { setupFixture } from './helpers/setup-fixture';

describe('UserController.ValidateUser (gRPC)', () => {
  test('should validate user via gRPC', async () => {
    const { grpcClient, module, teardown } = await setupFixture();
    const user = generateAccount();
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const userRepo = module.get<UserRepository>(Token.UserRepository);
    await userRepo.create({ ...user, password: hashedPassword });

    const response = (await new Promise((resolve, reject) => {
      grpcClient.ValidateUser(
        { username: user.username, password: user.password },
        (err: grpc.ServiceError, res: any) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    })) as any;

    expect(response).toMatchObject({
      data: {
        user: {
          username: user.username,
          email: user.email,
        },
      },
    });
    expect(response.data.user).not.toHaveProperty('password');

    await teardown();
  });

  test('ValidateUser rejects invalid credentials', async () => {
    const { grpcClient, teardown } = await setupFixture();

    await expect(
      new Promise((resolve, reject) => {
        grpcClient.ValidateUser(
          { username: 'invalid', password: 'wrong' },
          (err: grpc.ServiceError, res: any) => {
            if (err) reject(err);
            else resolve(res);
          }
        );
      })
    ).rejects.toMatchObject({
      code: grpc.status.UNAUTHENTICATED,
      details: 'Invalid username or password',
    });

    await teardown();
  });
});
