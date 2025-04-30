import { CreateUserRequest, Credentials } from '@lib/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserInput: CreateUserRequest) {
    const data = await this.authService.register(createUserInput);
    return { data };
  }

  @Post('login')
  async login(@Body() credentials: Credentials) {
    return this.authService.login(credentials);
  }
}
