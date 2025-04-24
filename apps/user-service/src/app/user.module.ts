import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Token } from './libs/token';
import { UserRepositoryFactory } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('USER_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: Token.UserRepository,
      useFactory: UserRepositoryFactory,
      inject: [getConnectionToken()],
    },
    UserService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
