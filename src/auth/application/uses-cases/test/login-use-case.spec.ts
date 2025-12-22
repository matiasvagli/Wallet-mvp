import { LoginUseCase } from '../login-use-case';
import { InMemoryAuthUserRepository } from '../../../infrastructure/persistence/in-memory-auth.repository';
import { FakePasswordHasher } from '../../../infrastructure/security/fake-password-hasher';
import { FakeTokenService } from '../../../infrastructure/security/fake-token-service';
import { AuthUser } from '../../../domain/entities/auth-user.entity';
import { UserId } from '../../../../user/domain/value-objects/user-id';

describe('LoginUseCase', () => {
  it('should login with valid email and password', async () => {
    const repo = new InMemoryAuthUserRepository();
    const hasher = new FakePasswordHasher();
    const tokenService = new FakeTokenService();
    const useCase = new LoginUseCase(repo, hasher, tokenService);

    // Pre-save a user
    const user = new AuthUser({
      userId: UserId.generate(),
      email: 'test@test.com',
      passwordHash: 'hashed:password123',
    });
    await repo.save(user);

    const result = await useCase.execute({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result.userId).toBeDefined();
    expect(result.token).toBeDefined();
  });

  it('should throw error with invalid password', async () => {
    const repo = new InMemoryAuthUserRepository();
    const hasher = new FakePasswordHasher();
    const tokenService = new FakeTokenService();
    const useCase = new LoginUseCase(repo, hasher, tokenService);

    // Pre-save a user
    const user = new AuthUser({
      userId: UserId.generate(),
      email: 'test@test.com',
      passwordHash: 'hashed:password123',
    });
    await repo.save(user);

    await expect(
      useCase.execute({
        email: 'test@test.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('should throw error with invalid email', async () => {
    const repo = new InMemoryAuthUserRepository();
    const hasher = new FakePasswordHasher();
    const tokenService = new FakeTokenService();
    const useCase = new LoginUseCase(repo, hasher, tokenService);

    await expect(
      useCase.execute({
        email: 'nonexistent@test.com',
        password: 'password123',
      }),
    ).rejects.toThrow('Invalid email or password');
  });
});
