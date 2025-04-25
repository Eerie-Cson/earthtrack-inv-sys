import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserModule } from './app/user.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(process.cwd(), 'scripts/proto/user.proto'),
        url: process.env.USER_GRPC_URL || '0.0.0.0:50051',
      },
    }
  );
  await app.listen();
  console.log('🚀 UserService gRPC listening on', process.env.USER_GRPC_URL);
}

bootstrap();
