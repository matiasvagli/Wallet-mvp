import {User} from '../entities/user/user.entity';
import {UserId} from '../value-objects/user-id';

export interface UserRepository {
    save(user: User): Promise<void>;
    findById(id: UserId): Promise<User | null>;
}