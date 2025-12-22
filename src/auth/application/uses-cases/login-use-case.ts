import { Inject } from '@nestjs/common';
import type { AuthUserRepository } from '../../domain/repositories/auth-repository';
import { AUTH_REPOSITORY } from '../../domain/repositories/auth-repository.token';
import { AuthUser } from '../../domain/entities/auth-user.entity';
import type { PasswordHasher } from '../../domain/services/password-hasher';


type LoginInput = {
    email: string;
    password: string;
};

export class LoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authUserRepository: AuthUserRepository,

    private readonly passwordHasher: PasswordHasher, 
  ) {}

  // hay que cambiar la promesa para que devuelva un token o algo asi a futuro
  async execute(input: LoginInput): Promise<AuthUser> {
    const user = await this.authUserRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await this.passwordHasher.compare(
      input.password,
      user.getPasswordHash(),
    );

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return user;
  }
}