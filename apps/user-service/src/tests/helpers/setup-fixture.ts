import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { getRandomPort } from 'get-port-please';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { join } from 'path';
import { UserModule } from '../../app/user.module';

export async function setupFixture(opts?: {
  mocks?: Array<{ type: unknown; value: unknown }>;
}) {
  const mongo = await MongoMemoryReplSet.create({
    replSet: { storageEngine: 'wiredTiger' },
    instanceOpts: [{ port: await getRandomPort() }],
  });

  const grpcPort = await getRandomPort();
  const grpcUrl = `0.0.0.0:${grpcPort}`;

  let builder = Test.createTestingModule({
    imports: [UserModule],
  })
    .overrideProvider(ConfigService)
    .useValue(
      new ConfigService({
        USER_URI: mongo.getUri('USER_URI'),
        USER_GRPC_URL: grpcUrl,
      })
    );

  for (const { type, value } of opts?.mocks ?? []) {
    builder = builder.overrideProvider(type).useValue(value);
  }

  const module = await builder.compile();
  const app = module.createNestMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(process.cwd(), 'scripts/proto/user.proto'),
      url: grpcUrl,
    },
  });

  await app.listen();

  const PROTO_PATH = join(process.cwd(), 'scripts/proto/user.proto');
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const proto = grpc.loadPackageDefinition(packageDefinition) as any;
  const client = new proto.user.UserService(
    grpcUrl,
    grpc.credentials.createInsecure()
  );

  return {
    grpcClient: client,
    module,
    teardown: async () => {
      await app.close();
      await module.close();
      await mongo.stop();
    },
  };
}
