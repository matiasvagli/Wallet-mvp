

import { Inject } from '@nestjs/common';
import type { AuthUserRepository } from '../../domain/repositories/auth-repository';
import { AUTH_REPOSITORY } from '../../domain/repositories/auth-repository.token';
import { AuthUser } from '../../domain/entities/auth-user.entity';
import { UserId } from '../../../user/domain/value-objects/user-id';
import type { PasswordHasher } from '../../domain/services/password-hasher';
import { PASSWORD_HASHER } from '../../domain/services/password-hasher.token';
import type { TokenService } from '../../domain/services/token-service';
import { TOKEN_SERVICE } from '../../domain/services/token-service.token';


type RegisterInput = {
    email: string;
    password: string;
};

export class RegisterUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authUserRepository: AuthUserRepository,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,

    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: RegisterInput): Promise<{ userId: string; token: string }> {
    if (input.password.length < 6) {
      throw new Error('Password too short');
    }

    const existingUser = await this.authUserRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);

    const user = new AuthUser({
      userId: UserId.generate(),
      email: input.email,
      passwordHash: hashedPassword,
    });

    await this.authUserRepository.save(user);

    const userId = user.getUserId().value;
    const token = await this.tokenService.sign(userId);

    return {
      userId,
      token,
    };
  }
}

