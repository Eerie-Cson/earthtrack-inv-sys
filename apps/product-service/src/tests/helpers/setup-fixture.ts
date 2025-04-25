import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRandomPort } from 'get-port-please';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import supertest from 'supertest';
import { ProductModule } from '../../app/product.module';

export async function setupFixture(opts?: {
  mocks?: [
    {
      type: unknown;
      value: unknown;
    }
  ];
}) {
  const port = await getRandomPort();

  const mongo = await MongoMemoryReplSet.create({
    replSet: {
      storageEngine: 'wiredTiger',
    },
    instanceOpts: [
      {
        launchTimeout: 30000,
        port: await getRandomPort(),
      },
    ],
  });

  const jwtSecret = 'test_jwt_secret';

  let builder = Test.createTestingModule({
    imports: [
      ProductModule,
      JwtModule.register({
        secret: jwtSecret,
      }),
    ],
  })
    .overrideProvider(ConfigService)
    .useValue(
      new ConfigService({
        PRODUCT_URI: mongo.getUri('PRODUCT_URI'),
        JWT_SECRET_KEY: jwtSecret,
      })
    );

  for (const { type, value } of opts?.mocks ?? []) {
    builder = builder.overrideProvider(type).useValue(value);
  }

  const module = await builder.compile();
  const app = module.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  await app.listen(port);

  return {
    request: supertest(app.getHttpServer()),
    module,
    teardown: async () => {
      await app.close();
      await module.close();
      await mongo.stop();
    },
  };
}
