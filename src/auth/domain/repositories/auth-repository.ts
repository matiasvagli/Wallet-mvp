import { AuthUser } from '../entities/auth-user.entity';``

export interface AuthUserRepository {
    save(user: AuthUser): Promise<void>;
    findByEmail(email: string): Promise<AuthUser | null>;
}