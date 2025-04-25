import { User } from '@lib/types';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc } from '@nestjs/microservices';
import * as R from 'ramda';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private userService;
  constructor(
    @Inject('USER_SERVICE') private client: ClientGrpc,
    private jwtService: JwtService
  ) {
    this.userService = this.client.getService('UserService');
  }

  // FOR FUTURE PURPOSE
  async register(createUserInput: Omit<User, 'id' | 'role'>) {
    await firstValueFrom(this.userService.CreateUser(createUserInput));
    return this.login({
      username: createUserInput.username,
      password: createUserInput.password,
    });
  }

  async login(credentials: { username: string; password: string }) {
    const response = (await firstValueFrom(
      this.userService.validateUser(credentials)
    )) as any;

    if (!response) throw new UnauthorizedException('Invalid credentials');
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
