import { UpdateUserNameUseCase } from '../update-user-name-use-case';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { InMemoryUserRepository } from '../../../infrastructure/persistence/in-memory-user.repository';
import { UserId } from '../../../domain/value-objects/user-id';
import { User } from '../../../domain/entities/user/user.entity';

describe('UpdateUserNameUseCase', () => {
  let updateUserNameUseCase: UpdateUserNameUseCase;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    updateUserNameUseCase = new UpdateUserNameUseCase(userRepository);
  });

  it('should update the user name successfully', async () => {
    // Arrange
    const userId = UserId.generate();

    const existingUser = new User({
      id: userId,
      firstName: 'Marge',
      lastName: 'Simpson',
      birthDate: new Date('1975-10-01'),
    });

    await userRepository.save(existingUser);

    const input = {
      userId: userId.value, // 👈 USAR value, no toString()
      newFirstName: 'Maggie',
      newLastName: 'Simpson',
    };

    // Act
    const updatedUser = await updateUserNameUseCase.execute(input);

    // Assert
    expect(updatedUser.getFirstName()).toBe('Maggie');
    expect(updatedUser.getLastName()).toBe('Simpson');

    const storedUser = await userRepository.findById(userId);
    expect(storedUser).not.toBeNull();
    expect(storedUser!.getFirstName()).toBe('Maggie');
    expect(storedUser!.getLastName()).toBe('Simpson');
  });

  it('should throw an error if user does not exist', async () => {
    const input = {
      userId: UserId.generate().value,
      newFirstName: 'Bart',
      newLastName: 'Simpson',
    };

    await expect(updateUserNameUseCase.execute(input))
      .rejects
      .toThrow('User not found');
  });
});