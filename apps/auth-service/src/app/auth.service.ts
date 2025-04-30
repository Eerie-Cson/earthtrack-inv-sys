import { ObjectId, ObjectType } from '@lib/object-id';
import { User } from '@lib/types';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc } from '@nestjs/microservices';
import * as R from 'ramda';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private userService;
  constructor(
    @Inject('USER_SERVICE') private client: ClientGrpc,
    private jwtService: JwtService
  ) {
    this.userService = this.client.getService('UserService');
  }

  async register(
    createUserInput: Omit<User, 'id' | 'role'> & { role: string }
  ) {
    try {
      const id = ObjectId.generate(ObjectType.ACCOUNT);
      await firstValueFrom(
        this.userService.CreateUser({ ...createUserInput, id })
      );

      return this.login({
        username: createUserInput.username,
        password: createUserInput.password,
      });
    } catch (error) {
      this.logger.error(
        `Registration failed: ${createUserInput.username}`,
        error.stack || error.message
      );
      throw error;
    }
  }

  async login(credentials: { username: string; password: string }) {
    const response = (await firstValueFrom(
      this.userService.validateUser(credentials)
    )) as any;

    if (!response) {
      this.logger.warn(
        `Login failed: Invalid credentials for ${credentials.username}`
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokenResponse(response.data.user as any);
  }

  private generateTokenResponse(user: User) {
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: R.omit(['password'], user),
    };
  }
}
