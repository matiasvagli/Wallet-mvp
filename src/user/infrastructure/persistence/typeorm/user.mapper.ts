import { User } from '../../../domain/entities/user/user.entity';
import { UserOrmEntity } from '../../persistence/typeorm/user.orm-entity';
import { UserId } from '../../../domain/value-objects/user-id';

export class UserMapper {
  static toDomain(entity: UserOrmEntity): User {
    return new User({
      id: UserId.create(entity.id),
      firstName: entity.firstName,
      lastName: entity.lastName,
      birthDate: entity.birthDate,
    });
  }

  static toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();

    orm.id = user.getId().value;
    orm.firstName = user.getFirstName();
    orm.lastName = user.getLastName();
    orm.birthDate = user.getBirthDate();

   

    return orm;
  }
}
