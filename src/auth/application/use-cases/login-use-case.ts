import { Inject } from '@nestjs/common';
import type { AuthUserRepository } from '../../domain/repositories/auth-repository';
import { AUTH_REPOSITORY } from '../../domain/repositories/auth-repository.token';
import type { PasswordHasher } from '../../domain/services/password-hasher';
import { PASSWORD_HASHER } from '../../domain/services/password-hasher.token';
import type { TokenService } from '../../domain/services/token-service';
import { TOKEN_SERVICE } from '../../domain/services/token-service.token';

type LoginInput = {
  email: string;
  password: string;
};

export class LoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authUserRepository: AuthUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    input: LoginInput,
  ): Promise<{ userId: string; token: string }> {
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

    const userId = user.getUserId().value;
    const token = await this.tokenService.sign(userId);

    return {
      userId,
      token,
    };
  }
}
