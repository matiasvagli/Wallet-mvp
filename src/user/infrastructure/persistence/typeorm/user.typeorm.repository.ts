import { Repository } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { User } from '../../../domain/entities/user/user.entity';
import { UserMapper } from './user.mapper';
import { UserId } from '../../../domain/value-objects/user-id';
import { UserRepository } from '../../../domain/repositories/user-repository';

export class UserTypeOrmRepository implements UserRepository {
  constructor(
    private readonly ormRepository: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const ormEntity = UserMapper.toOrm(user);
    await this.ormRepository.save(ormEntity);
  }

  async findById(id: UserId): Promise<User | null> {
  const entity = await this.ormRepository.findOneBy({
    id: id.value,
  });

  return entity ? UserMapper.toDomain(entity) : null;
}

}
