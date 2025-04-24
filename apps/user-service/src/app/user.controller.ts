import { ObjectId, ObjectType } from '@lib/object-id';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import * as R from 'ramda';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserInput: CreateUserDto) {
    await this.userService.createUser({
      id: ObjectId.generate(ObjectType.ACCOUNT),
      ...createUserInput,
    });

    return { data: true };
  }

  @Post('/validate')
  async validateUser(
    @Body() credentials: { username: string; password: string }
  ) {
    const user = await this.userService.validateUser(
      credentials.username,
      credentials.password
    );
    //Add error handling if possible
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return { data: user };
  }

  @Get('/:id')
  async me(@Param('id') id: string) {
    const user = await this.userService.findUser(ObjectId.from(id));
    return { data: R.omit(['password'], user) };
  }
}
