import { Controller, Post, Body } from '@nestjs/common';

import { LoginUseCase } from '../../application/use-cases/login-use-case';
import { RegisterUseCase } from '../../application/use-cases/register-use-case';

type LoginDto = {
  email: string;
  password: string;
};

type RegisterDto = {
  email: string;
  password: string;
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const result = await this.loginUseCase.execute({
      email: body.email,
      password: body.password,
    });

    return {
      accessToken: result.token,
    };
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const result = await this.registerUseCase.execute({
      email: body.email,
      password: body.password,
    });

    return {
      accessToken: result.token,
    };
  }
}
