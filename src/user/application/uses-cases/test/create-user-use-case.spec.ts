import { CreateUserUseCase } from '../create-user-use-case';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { InMemoryUserRepository } from '../../../infrastructure/persistence/in-memory-user.repository';
import { UserId } from '../../../domain/value-objects/user-id';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('should create a user with a valid UserId', async () => {
    const input = {
      firstName: 'Homero',
      lastName: 'Simpson',
      birthDate: new Date('1970-05-12'),
    };

    const result = await createUserUseCase.execute(input);

   expect(result).toBeDefined();
   expect(result.getId()).toBeInstanceOf(UserId);
   expect(result.getFirstName()).toBe(input.firstName);
   expect(result.getLastName()).toBe(input.lastName);
   expect(result.getBirthDate()).toBe(input.birthDate);


    const savedUser = await userRepository.findById(result.getId());
    expect(savedUser).toEqual(result);
  });

  it('should throw an error if input data is invalid', async () => {
    const input = {
      firstName: '', // Invalid first name
      lastName: 'Simpson',
      birthDate: new Date('1990-01-01'),
    };

  await expect(createUserUseCase.execute(input))
  .rejects
  .toThrow('First name is required');

  });
});