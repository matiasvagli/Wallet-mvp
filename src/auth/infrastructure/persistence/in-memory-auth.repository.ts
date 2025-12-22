import { AuthUserRepository } from '../../domain/repositories/auth-repository';
import { AuthUser } from '../../domain/entities/auth-user.entity';

export class InMemoryAuthUserRepository implements AuthUserRepository {
  private readonly usersByEmail = new Map<string, AuthUser>();

  async findByEmail(email: string): Promise<AuthUser | null> {
    return this.usersByEmail.get(email) ?? null;
  }

  async save(user: AuthUser): Promise<void> {
    this.usersByEmail.set(user.getEmail(), user);
  }
}
