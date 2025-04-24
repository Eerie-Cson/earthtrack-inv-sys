import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { JwtStrategy } from '../../libs/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        useFactory: (cfg: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'user',
            protoPath: join(
              process.cwd(),
              'packages/shared/src/proto/user.proto'
            ),
            url: cfg.get<string>('USER_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const secret = await config.get('JWT_SECRET_KEY');
        return {
          secret,
        };
      },
    }),
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
