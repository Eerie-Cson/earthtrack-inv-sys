import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  private get userServiceUrl(): string {
    return this.configService.get('USER_SERVICE_URL');
  }

  async register(createUserInput: CreateUserDto) {
    await firstValueFrom(
      this.httpService.post(`${this.userServiceUrl}/users`, createUserInput)
    );

    return this.login({
      username: createUserInput.username,
      password: createUserInput.password,
    });
  }

  async login(credentials: { username: string; password: string }) {
    try {
      const { data: user } = await firstValueFrom(
        this.httpService.post(
          `${this.userServiceUrl}/users/validate`,
          credentials
        )
      );

      if (!user) throw new UnauthorizedException('Invalid credentials');

      const payload = {
        sub: user.id,
        username: user.username,
        role: user.role,
      };

      return {
        user,
        accessToken: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
