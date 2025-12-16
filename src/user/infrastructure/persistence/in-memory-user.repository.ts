import { UserRepository } from '../../domain/repositories/user-repository';
import { User } from '../../domain/entities/user/user.entity';
import { UserId } from '../../domain/value-objects/user-id';

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.getId().value, user);
  }

  
  async findById(id: string | UserId): Promise<User | null> {
    const key = typeof id === 'string' ? id : id.value;
    return this.users.get(key) ?? null;
  }
}
