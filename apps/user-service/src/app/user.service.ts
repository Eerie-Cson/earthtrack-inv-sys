import { AccountRole, User } from '@lib/types';
import { normalizeDocument } from '@lib/util';
import { Inject, Injectable, Logger } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { FilterQuery } from 'mongoose';
import * as R from 'ramda';
import {
  DuplicateUsernameError,
  InvalidCredentialsError,
  UserCreationError,
  UserError,
  UserNotFoundError,
} from '../error';
import { Token } from './libs/token';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(
    @Inject(Token.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async createUser(
    input: Omit<User, 'role'> & { role: string }
  ): Promise<void> {
    try {
      if (!Object.values(AccountRole).includes(input.role as AccountRole))
        throw new UserCreationError('Invalid role type', input.username);

      const role = input.role as AccountRole;

      const existingUser = await this.userRepository.find({
        username: input.username,
      });
      if (existingUser) {
        this.logger.warn(`Duplicate username attempt: ${input.username}`, {
          username: input.username,
          role: input.role,
        });

        throw new DuplicateUsernameError(input.username);
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      await this.userRepository.create({
        ...input,
        role,
        password: hashedPassword,
      });
    } catch (error) {
      this.logger.error(`User creation failed`, {
        username: input.username,
        error: error.name,
      });

      if (error instanceof UserError) throw error;

      throw new UserCreationError(error.message, { error: error.toString() });
    }
  }

  async findUser(
    params: FilterQuery<User>
  ): Promise<ReturnType<typeof normalizeDocument<User>> | null> {
    try {
      const user = await this.userRepository.find(params);

      if (!user) {
        return null;
      }
      return normalizeDocument(user);
    } catch (error) {
      this.logger.error(`User lookup failed`, {
        query: params,
        error: error.message,
      });

      if (error instanceof UserError) throw error;
      throw new UserNotFoundError(params.id || params.username || '');
    }
  }

  async validateUser(
    username: string,
    password: string
  ): Promise<(Omit<User, 'password' | 'id'> & { id: string }) | null> {
    try {
      const user = await this.findUser({ username });
      if (!user) {
        this.logger.warn(`Invalid login attempt`, {
          username,
          reason: 'Invalid username or password',
        });
        throw new InvalidCredentialsError();
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        this.logger.warn(`Invalid login attempt`, {
          username,
          reason: 'Invalid username or password',
        });
        throw new InvalidCredentialsError();
      }

      return R.omit(['password'], user);
    } catch (error) {
      this.logger.error(`Authentication failed`, {
        username,
        error: error.message,
      });

      if (error instanceof UserError) throw error;
      throw new InvalidCredentialsError();
    }
  }
}
