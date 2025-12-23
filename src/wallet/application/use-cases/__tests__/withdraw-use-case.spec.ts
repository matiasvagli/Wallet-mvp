import { WithdrawUseCase } from '../withdraw-use-case';
import { InMemoryWalletRepository } from '../../../infrastructure/persistence/in-memory-wallet.repository';
import { InMemoryUserRepository } from '../../../../user/infrastructure/persistence/in-memory-user.repository';

import { Wallet } from '../../../domain/entities/wallet.entity';
import { WalletType } from '../../../domain/value-objects/wallet-type';
import { Money } from '../../../domain/value-objects/money';
import { Currency } from '../../../domain/value-objects/currency';
import { WalletId } from '../../../domain/value-objects/wallet-id';

import { User } from '../../../../user/domain/entities/user/user.entity';
import { UserId } from '../../../../user/domain/value-objects/user-id';

const ARS = Currency.create('ARS');

describe('WithdrawUseCase', () => {

  it('auto-upgrades teen wallet when user is adult before withdraw', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const userRepository = new InMemoryUserRepository();
    const useCase = new WithdrawUseCase(walletRepository, userRepository);

    // User adulto
    const user = new User({
      id: UserId.generate(),
      firstName: 'Homero',
      lastName: 'Simpson',
      birthDate: new Date('1990-01-01'),
    });
    await userRepository.save(user);

    // Wallet TEEN
    const wallet = new Wallet({
      id: WalletId.generate().value,
      currency: ARS,
      initialBalance: new Money(100),
      type: WalletType.TEEN,
      teenRules: {
        parentWalletId: WalletId.generate().value,
      },
    });
    await walletRepository.save(wallet, user.getId());

    const result = await useCase.execute(
      user.getId().value,
      wallet.getId(),
      new Money(40),
    );

    expect(result.getType()).toBe(WalletType.STANDARD);
    expect(result.getBalance().value).toBe(60);
  });

  it('does NOT upgrade teen wallet when user is under 18', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const userRepository = new InMemoryUserRepository();
    const useCase = new WithdrawUseCase(walletRepository, userRepository);

    // User menor
    const user = new User({
      id: UserId.generate(),
      firstName: 'Lisa',
      lastName: 'Simpson',
      birthDate: new Date('2010-01-01'),
    });
    await userRepository.save(user);

    // Wallet TEEN
    const wallet = new Wallet({
      id: WalletId.generate().value,
      currency: ARS,
      initialBalance: new Money(100),
      type: WalletType.TEEN,
      teenRules: {
        parentWalletId: WalletId.generate().value,
      },
    });
    await walletRepository.save(wallet, user.getId());

    const result = await useCase.execute(
      user.getId().value,
      wallet.getId(),
      new Money(40),
    );

    expect(result.getType()).toBe(WalletType.TEEN);
    expect(result.getBalance().value).toBe(60);
  });

  it('withdraws normally when wallet is standard', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const userRepository = new InMemoryUserRepository();
    const useCase = new WithdrawUseCase(walletRepository, userRepository);

    // User adulto
    const user = new User({
      id: UserId.generate(),
      firstName: 'Marge',
      lastName: 'Simpson',
      birthDate: new Date('1980-01-01'),
    });
    await userRepository.save(user);

    // Wallet STANDARD
    const wallet = new Wallet({
      id: WalletId.generate().value,
      currency: ARS,
      initialBalance: new Money(100),
      type: WalletType.STANDARD,
    });
    await walletRepository.save(wallet, user.getId());

    const result = await useCase.execute(
      user.getId().value,
      wallet.getId(),
      new Money(40),
    );

    expect(result.getType()).toBe(WalletType.STANDARD);
    expect(result.getBalance().value).toBe(60);
  });

});
