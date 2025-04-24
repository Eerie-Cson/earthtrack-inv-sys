import { User } from '@lib/types';
import { normalizeDocument } from '@lib/util';
import { Inject, Injectable, Logger } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { FilterQuery } from 'mongoose';
import * as R from 'ramda';
import { Token } from './libs/token';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(Token.UserRepository)
    private readonly userRepository: UserRepository
  ) {}
  async createUser(input: User) {
    const hashedPassword = await bcrypt.hash(input.password, 10);

    return this.userRepository.create({
      ...input,
      password: hashedPassword,
    });
  }

  async findUser(params: FilterQuery<User>) {
    const product = await this.userRepository.find(params);
    if (!product) return null;

    return normalizeDocument(product);
  }

  async validateUser(username: string, password: string) {
    const user = await this.findUser({ username: username });
    if (user && (await bcrypt.compare(password, user.password))) {
      return R.omit(['password'], user);
    }
    return null;
  }
}
