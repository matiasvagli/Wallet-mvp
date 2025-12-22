import { UserId } from '../../../user/domain/value-objects/user-id';

type AuthUserProps = {
  userId: UserId;
  email: string;
  passwordHash: string;
};

export class AuthUser {
  private readonly userId: UserId;
  private readonly email: string;
  private passwordHash: string;

  constructor(props: AuthUserProps) {
    const { userId, email, passwordHash } = props;

    this.ensureValidEmail(email);
    this.ensureValidPasswordHash(passwordHash);

    this.userId = userId;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  getUserId(): UserId {
    return this.userId;
  }

  getEmail(): string {
    return this.email;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  changePassword(newPasswordHash: string): void {
    this.ensureValidPasswordHash(newPasswordHash);
    this.passwordHash = newPasswordHash;
  }

  private ensureValidEmail(email: string): void {
    if (!email.includes('@')) {
      throw new Error('Invalid email');
    }
  }

  private ensureValidPasswordHash(hash: string): void {
    if (!hash || hash.length < 10) {
      throw new Error('Invalid password hash');
    }
  }
}
