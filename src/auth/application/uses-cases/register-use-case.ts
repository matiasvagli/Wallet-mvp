

import { Inject } from '@nestjs/common';
import type { AuthUserRepository } from '../../domain/repositories/auth-repository';
import { AUTH_REPOSITORY } from '../../domain/repositories/auth-repository.token';
import { AuthUser } from '../../domain/entities/auth-user.entity';
import { UserId } from '../../../user/domain/value-objects/user-id';
import type { PasswordHasher } from '../../domain/services/password-hasher';



type RegisterInput = {
    email: string;
    password: string;
};

export class RegisterUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authUserRepository: AuthUserRepository,

    private readonly passwordHasher: PasswordHasher, 
  ) {}

  async execute(input: RegisterInput): Promise<AuthUser> {
    
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

    return user;
  }
}
