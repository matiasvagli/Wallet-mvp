import { TransferUseCase } from '../transfer-use-case';
import { InMemoryWalletRepository } from '../../../infrastructure/persistence/in-memory-wallet.repository';
import { Wallet } from '../../../domain/entities/wallet.entity';

const UUID_FROM = '550e8400-e29b-41d4-a716-446655440032';
const UUID_TO = '550e8400-e29b-41d4-a716-446655440033';

describe('TransferUseCase', () => {
  it('should transfer amount from one wallet to another', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const transferUseCase = new TransferUseCase(walletRepository);

    const fromInitialBalance = 200;
    const fromWallet = new Wallet({
      id: UUID_FROM,
      currency: 'ARS',
      initialBalance: fromInitialBalance,
    });
    await walletRepository.save(fromWallet);

    const toInitialBalance = 100;
    const toWallet = new Wallet({
      id: UUID_TO,
      currency: 'ARS',
      initialBalance: toInitialBalance,
    });
    await walletRepository.save(toWallet);

    const transferAmount = 50;
    const { fromWallet: updatedFromWallet, toWallet: updatedToWallet } =
      await transferUseCase.execute(UUID_FROM, UUID_TO, transferAmount);

    expect(updatedFromWallet.getBalance()).toBe(
      fromInitialBalance - transferAmount,
    );
    expect(updatedToWallet.getBalance()).toBe(
      toInitialBalance + transferAmount,
    );

    const storedFromWallet = await walletRepository.findById(UUID_FROM);
    expect(storedFromWallet?.getBalance()).toBe(
      fromInitialBalance - transferAmount,
    );

    const storedToWallet = await walletRepository.findById(UUID_TO);
    expect(storedToWallet?.getBalance()).toBe(
      toInitialBalance + transferAmount,
    );
  });

  it('should throw an error when source wallet does not exist', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const transferUseCase = new TransferUseCase(walletRepository);

    const toInitialBalance = 100;
    const toWallet = new Wallet({
      id: UUID_TO,
      currency: 'ARS',
      initialBalance: toInitialBalance,
    });
    await walletRepository.save(toWallet);

    const nonExistingUUID = '550e8400-e29b-41d4-a716-446655440099';
    await expect(
      transferUseCase.execute(nonExistingUUID, UUID_TO, 50),
    ).rejects.toThrow('Source wallet not found');
  });

  it('should throw an error when destination wallet does not exist', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const transferUseCase = new TransferUseCase(walletRepository);

    const fromInitialBalance = 200;
    const fromWallet = new Wallet({
      id: UUID_FROM,
      currency: 'ARS',
      initialBalance: fromInitialBalance,
    });
    await walletRepository.save(fromWallet);

    const nonExistingUUID = '550e8400-e29b-41d4-a716-446655440088';
    await expect(
      transferUseCase.execute(UUID_FROM, nonExistingUUID, 50),
    ).rejects.toThrow('Destination wallet not found');
  });
});
