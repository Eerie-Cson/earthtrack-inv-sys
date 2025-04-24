import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserInput: CreateUserDto) {
    const data = await this.authService.register(createUserInput);
    return { data };
  }

  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }
}
