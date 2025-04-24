import { ObjectId, ObjectType } from '@lib/object-id';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserInput: CreateUserDto) {
    await this.userService.createUser({
      ...createUserInput,
      id: ObjectId.generate(ObjectType.ACCOUNT),
    });

    return true;
  }

  @Get('/:id')
  async me(@Param('id') id: string) {
    return this.userService.findUser(ObjectId.from(id));
  }
}
