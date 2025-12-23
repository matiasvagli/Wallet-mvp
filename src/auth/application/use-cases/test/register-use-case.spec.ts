import { RegisterUseCase } from '../register-use-case';
import { InMemoryAuthUserRepository } from '../../../infrastructure/persistence/in-memory-auth.repository';
import { FakePasswordHasher } from '../../../infrastructure/security/fake-password-hasher';
import { FakeTokenService } from '../../../infrastructure/security/fake-token-service';
import { AuthUser } from '../../../domain/entities/auth-user.entity';
import { UserId } from '../../../../user/domain/value-objects/user-id';

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;
  let authUserRepository: InMemoryAuthUserRepository;
  let passwordHasher: FakePasswordHasher;
  let tokenService: FakeTokenService;

  beforeEach(() => {
    authUserRepository = new InMemoryAuthUserRepository();
    passwordHasher = new FakePasswordHasher();
    tokenService = new FakeTokenService();
    registerUseCase = new RegisterUseCase(
      authUserRepository,
      passwordHasher,
      tokenService,
    );
  });

  it('registers a user successfully and returns a token', async () => {
    const { userId, token } = await registerUseCase.execute({
      email: 'test@test.com',
      password: 'password123',
    });

    // El userId debe ser un string válido
    expect(typeof userId).toBe('string');
    expect(userId.length).toBeGreaterThan(0);

    // El token debe tener el formato del FakeTokenService
    expect(typeof token).toBe('string');
    expect(token.startsWith('signed-token-for-')).toBe(true);

    // Verificamos que el usuario fue persistido correctamente
    const saved = await authUserRepository.findByEmail('test@test.com');
    expect(saved).not.toBeNull();
    expect(saved?.getEmail()).toBe('test@test.com');
    expect(saved?.getPasswordHash()).toBe('hashed:password123');
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
