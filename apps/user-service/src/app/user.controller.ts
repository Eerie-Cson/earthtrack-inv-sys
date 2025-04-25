import { ObjectId, ObjectType } from '@lib/object-id';
import { CreateUserRequest } from '@lib/shared';
import { AccountRole } from '@lib/types';
import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import {
  BaseRpcExceptionFilter,
  GrpcMethod,
  RpcException,
} from '@nestjs/microservices';
import * as R from 'ramda';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUser')
  @Post()
  async createUser(@Body() createUserInput: CreateUserRequest) {
    await this.userService.createUser({
      id: ObjectId.generate(ObjectType.ACCOUNT),
      role: AccountRole.User,
      ...createUserInput,
    });

    return { data: true };
  }

  @UseFilters(new BaseRpcExceptionFilter())
  @GrpcMethod('UserService', 'ValidateUser')
  @Post('/validate')
  async validateUser(
    @Body() credentials: { username: string; password: string }
  ) {
    const user = await this.userService.validateUser(
      credentials.username,
      credentials.password
    );
    //Add error handling if possible
    if (!user) throw new RpcException('Invalid credentials');
    return { data: { user } };
  }

  @Get('/:id')
  async me(@Param('id') id: string) {
    const user = await this.userService.findUser(ObjectId.from(id));
    return { data: R.omit(['password'], user) };
  }
}
