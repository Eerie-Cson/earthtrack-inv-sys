import { status } from '@grpc/grpc-js';
import { ObjectId, ObjectType } from '@lib/object-id';
import { CreateUserRequest } from '@lib/shared';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import {
  BaseRpcExceptionFilter,
  GrpcMethod,
  RpcException,
} from '@nestjs/microservices';
import * as R from 'ramda';
import { UserError, UserNotFoundError } from '../error';
import { UserService } from './user.service';

@Controller('user')
@UseFilters(BaseRpcExceptionFilter)
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUser')
  @Post()
  async createUser(@Body() createUserInput: CreateUserRequest) {
    const id = ObjectId.generate(ObjectType.ACCOUNT);

    try {
      await this.userService.createUser({
        id,
        ...createUserInput,
      });

      return { data: true };
    } catch (error) {
      this.logger.error(`User creation failed`, {
        username: createUserInput.username,
        id: id.toString(),
        error: error.message,
      });

      if (error instanceof UserError) {
        throw new RpcException({
          code: error.grpcStatus,
          message: error.message,
          details: error.metadata,
        });
      }
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Internal server error',
      });
    }
  }

  @GrpcMethod('UserService', 'ValidateUser')
  @Post('/validate')
  async validateUser(
    @Body() credentials: { username: string; password: string }
  ) {
    try {
      const user = await this.userService.validateUser(
        credentials.username,
        credentials.password
      );
      if (!user) {
        this.logger.warn(
          `Invalid credentials for user: ${credentials.username}`
        );

        throw new RpcException({
          code: status.UNAUTHENTICATED,
          details: 'Invalid credentials',
        });
      }

      return { data: { user } };
    } catch (error) {
      if (error instanceof UserError) {
        throw new RpcException({
          code: error.grpcStatus,
          message: error.message,
          details: error.metadata,
        });
      }
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Internal server error',
      });
    }
  }

  @Get('/:id')
  async getCurrentUser(@Param('id') id: string) {
    const objectId = ObjectId.from(id);
    try {
      const user = await this.userService.findUser(objectId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return { data: R.omit(['password'], user) };
    } catch (error) {
      this.logger.error(`Error fetching user`, {
        userId: id,
        error: error.message,
      });

      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw new InternalServerErrorException('An error occurred');
    }
  }
}
