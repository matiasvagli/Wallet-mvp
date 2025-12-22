import { RegisterUseCase } from '../register-use-case';
import { InMemoryAuthUserRepository } from '../../../infrastructure/persistence/in-memory-auth.repository';
import { FakePasswordHasher } from '../../../infrastructure/security/fake-password-hasher';
import { AuthUser } from '../../../domain/entities/auth-user.entity';
import { UserId } from '../../../../user/domain/value-objects/user-id';

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;
  let authUserRepository: InMemoryAuthUserRepository;
  let passwordHasher: FakePasswordHasher;

  beforeEach(() => {
    authUserRepository = new InMemoryAuthUserRepository();
    passwordHasher = new FakePasswordHasher();
    registerUseCase = new RegisterUseCase(
      authUserRepository,
      passwordHasher,
    );
  });

  it('registers a user successfully', async () => {
    const result = await registerUseCase.execute({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result.getEmail()).toBe('test@test.com');
    expect(result.getPasswordHash()).toBe('hashed:password123');
  });

  it('throws if email already exists', async () => {
    await authUserRepository.save(
      new AuthUser({
        userId: UserId.generate(),
        email: 'test@test.com',
        passwordHash: 'hashed:password123',
      }),
    );

    await expect(
      registerUseCase.execute({
        email: 'test@test.com',
        password: 'password123',
      }),
    ).rejects.toThrow('Email already in use');
  });

  it('throws if password is too short', async () => {
    await expect(
      registerUseCase.execute({
        email: 'test@test.com',
        password: '123',
      }),
    ).rejects.toThrow('Password too short');
  });
});
