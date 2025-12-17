import { TransferUseCase } from '../transfer-use-case';
import { InMemoryWalletRepository } from '../../../infrastructure/persistence/in-memory-wallet.repository';
import { Wallet } from '../../../domain/entities/wallet.entity';
import { Money } from '../../../domain/value-objects/money';
import { Currency } from '../../../domain/value-objects/currency';

const UUID_FROM = '550e8400-e29b-41d4-a716-446655440032';
const UUID_TO = '550e8400-e29b-41d4-a716-446655440033';
const ARS = Currency.create('ARS');

describe('TransferUseCase', () => {
  it('should transfer amount from one wallet to another', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const transferUseCase = new TransferUseCase(walletRepository);

    const fromInitialBalance = new Money(200);
    const fromWallet = new Wallet({
      id: UUID_FROM,
      currency: ARS,
      initialBalance: fromInitialBalance,
    });
    await walletRepository.save(fromWallet);

    const toInitialBalance = new Money(100);
    const toWallet = new Wallet({
      id: UUID_TO,
      currency: ARS,
      initialBalance: toInitialBalance,
    });
    await walletRepository.save(toWallet);

    const transferAmount = new Money(50);
    const { fromWallet: updatedFromWallet, toWallet: updatedToWallet } =
      await transferUseCase.execute(UUID_FROM, UUID_TO, transferAmount);

    expect(updatedFromWallet.getBalance().value).toBe(
      fromInitialBalance.value - transferAmount.value,
    );
    expect(updatedToWallet.getBalance().value).toBe(
      toInitialBalance.value + transferAmount.value,
    );

    const storedFromWallet = await walletRepository.findById(UUID_FROM);
    expect(storedFromWallet?.getBalance().value).toBe(
      fromInitialBalance.value - transferAmount.value,
    );

    const storedToWallet = await walletRepository.findById(UUID_TO);
    expect(storedToWallet?.getBalance().value).toBe(
      toInitialBalance.value + transferAmount.value,
    );
  });

  it('should throw an error when source wallet does not exist', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const transferUseCase = new TransferUseCase(walletRepository);

    const toInitialBalance = new Money(100);
    const toWallet = new Wallet({
      id: UUID_TO,
      currency: ARS,
      initialBalance: toInitialBalance,
    });
    await walletRepository.save(toWallet);

    const nonExistingUUID = '550e8400-e29b-41d4-a716-446655440099';
    const transferAmount = new Money(50);
    await expect(
      transferUseCase.execute(nonExistingUUID, UUID_TO, transferAmount),
    ).rejects.toThrow('Source wallet not found');
  });

  it('should throw an error when destination wallet does not exist', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const transferUseCase = new TransferUseCase(walletRepository);

    const fromInitialBalance = new Money(200);
    const fromWallet = new Wallet({
      id: UUID_FROM,
      currency: ARS,
      initialBalance: fromInitialBalance,
    });
    await walletRepository.save(fromWallet);
    const nonExistingUUID = '550e8400-e29b-41d4-a716-446655440088';
    const transferAmount = new Money(50);
    await expect(
      transferUseCase.execute(UUID_FROM, nonExistingUUID, transferAmount),
    ).rejects.toThrow('Destination wallet not found');
  });
});
