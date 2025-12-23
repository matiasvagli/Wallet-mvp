import type { AuthUserRepository } from '../../domain/repositories/auth-repository';
import type { PasswordHasher } from '../../domain/services/password-hasher';
import type { TokenService } from '../../domain/services/token-service';

type LoginInput = {
  email: string;
  password: string;
};

export class LoginUseCase {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly passwordHasher: PasswordHasher,
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
