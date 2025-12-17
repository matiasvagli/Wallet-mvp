import { PayUseCase } from '../pay-use-case';
import { InMemoryWalletRepository } from '../../../infrastructure/persistence/in-memory-wallet.repository';
import { Wallet } from '../../../domain/entities/wallet.entity';
import { WalletType } from '../../../domain/value-objects/wallet-type';
import { Money } from '../../../domain/value-objects/money';
import { Currency } from '../../../domain/value-objects/currency';

const UUID_TEEN_1 = '550e8400-e29b-41d4-a716-446655440040';
const UUID_TEEN_2 = '550e8400-e29b-41d4-a716-446655440041';
const UUID_STANDARD = '550e8400-e29b-41d4-a716-446655440042';
const UUID_PARENT = '550e8400-e29b-41d4-a716-446655440043';
const ARS = Currency.create('ARS');

describe('PayUseCase', () => {
  let repository: InMemoryWalletRepository;
  let useCase: PayUseCase;

  beforeEach(() => {
    repository = new InMemoryWalletRepository();
    useCase = new PayUseCase(repository);
  });

  it('should allow a teen wallet to pay within limit', async () => {
    const teenWallet = new Wallet({
      id: UUID_TEEN_1,
      currency: ARS,
      initialBalance: new Money(150),
      type: WalletType.TEEN,
      teenRules: {
        parentWalletId: UUID_PARENT,
        perTransactionLimit: new Money(100),
      },
    });

    await repository.save(teenWallet);

    const result = await useCase.execute(UUID_TEEN_1, new Money(80));

    expect(result.getBalance().value).toBe(70);
  });

  it('should not allow a teen wallet to pay over limit', async () => {
    const teenWallet = new Wallet({
      id: UUID_TEEN_2,
      currency: ARS,
      initialBalance: new Money(150),
      type: WalletType.TEEN,
      teenRules: {
        parentWalletId: UUID_PARENT,
        perTransactionLimit: new Money(50),
      },
    });

    await repository.save(teenWallet);

    await expect(
      useCase.execute(UUID_TEEN_2, new Money(80)),
    ).rejects.toThrow('Amount exceeds per transaction limit');
  });

  it('should not allow a standard wallet to pay', async () => {
    const standardWallet = new Wallet({
      id: UUID_STANDARD,
      currency: ARS,
      initialBalance: new Money(100),
    });

    await repository.save(standardWallet);

    await expect(
      useCase.execute(UUID_STANDARD, new Money(30)),
    ).rejects.toThrow('Pay operation only available for teen wallets');
  });

  it('should throw if wallet does not exist', async () => {
    const nonExistingUUID = '550e8400-e29b-41d4-a716-446655440077';
    await expect(
      useCase.execute(nonExistingUUID, new Money(50)),
    ).rejects.toThrow('Wallet not found');
  });
});
