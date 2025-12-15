import { PayUseCase } from '../pay-use-case';
import { InMemoryWalletRepository } from '../../../infrastructure/persistence/in-memory-wallet.repository';
import { Wallet } from '../../../domain/entities/wallet.entity';
import { WalletType } from '../../../domain/value-objects/wallet-type';

describe('PayUseCase', () => {
  let repository: InMemoryWalletRepository;
  let useCase: PayUseCase;

  beforeEach(() => {
    repository = new InMemoryWalletRepository();
    useCase = new PayUseCase(repository);
  });

  it('should allow a teen wallet to pay within limit', async () => {
    const teenWallet = new Wallet({
      id: 'teen-1',
      currency: 'ARS',
      initialBalance: 150,
      type: WalletType.TEEN,
      teenRules: {
        parentWalletId: 'parent-1',
        perTransactionLimit: 100,
      },
    });

    await repository.save(teenWallet);

    const result = await useCase.execute('teen-1', 80);

    expect(result.getBalance()).toBe(70);
  });

  it('should not allow a teen wallet to pay over limit', async () => {
    const teenWallet = new Wallet({
      id: 'teen-2',
      currency: 'ARS',
      initialBalance: 150,
      type: WalletType.TEEN,
      teenRules: {
        parentWalletId: 'parent-1',
        perTransactionLimit: 50,
      },
    });

    await repository.save(teenWallet);

    await expect(
      useCase.execute('teen-2', 80),
    ).rejects.toThrow('Amount exceeds per transaction limit');
  });

  it('should not allow a standard wallet to pay', async () => {
    const standardWallet = new Wallet({
      id: 'std-1',
      currency: 'ARS',
      initialBalance: 100,
    });

    await repository.save(standardWallet);

    await expect(
      useCase.execute('std-1', 30),
    ).rejects.toThrow('Pay operation only available for teen wallets');
  });

  it('should throw if wallet does not exist', async () => {
    await expect(
      useCase.execute('missing-wallet', 50),
    ).rejects.toThrow('Wallet not found');
  });
});
