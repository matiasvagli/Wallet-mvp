import { TransferUseCase } from '../transfer-use-case';
import { InMemoryWalletRepository } from '../../../infrastructure/persistence/in-memory-wallet.repository';
import { Wallet } from '../../../domain/entities/wallet.entity';

describe('TransferUseCase', () => {
  it('should transfer amount from one wallet to another', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const transferUseCase = new TransferUseCase(walletRepository);

    const fromWalletId = '1';
    const fromInitialBalance = 200;
    const fromWallet = new Wallet({
      id: fromWalletId,
      currency: 'ARS',
      initialBalance: fromInitialBalance,
    });
    await walletRepository.save(fromWallet);

    const toWalletId = '2';
    const toInitialBalance = 100;
    const toWallet = new Wallet({
      id: toWalletId,
      currency: 'ARS',
      initialBalance: toInitialBalance,
    });
    await walletRepository.save(toWallet);

    const transferAmount = 50;
    const { fromWallet: updatedFromWallet, toWallet: updatedToWallet } =
      await transferUseCase.execute(fromWalletId, toWalletId, transferAmount);

    expect(updatedFromWallet.getBalance()).toBe(
      fromInitialBalance - transferAmount,
    );
    expect(updatedToWallet.getBalance()).toBe(
      toInitialBalance + transferAmount,
    );

    const storedFromWallet = await walletRepository.findById(fromWalletId);
    expect(storedFromWallet?.getBalance()).toBe(
      fromInitialBalance - transferAmount,
    );

    const storedToWallet = await walletRepository.findById(toWalletId);
    expect(storedToWallet?.getBalance()).toBe(
      toInitialBalance + transferAmount,
    );
  });

  it('should throw an error when source wallet does not exist', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const transferUseCase = new TransferUseCase(walletRepository);

    const toWalletId = '2';
    const toInitialBalance = 100;
    const toWallet = new Wallet({
      id: toWalletId,
      currency: 'ARS',
      initialBalance: toInitialBalance,
    });
    await walletRepository.save(toWallet);

    await expect(
      transferUseCase.execute('non-existing-id', toWalletId, 50),
    ).rejects.toThrow('Source wallet not found');
  });

  it('should throw an error when destination wallet does not exist', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const transferUseCase = new TransferUseCase(walletRepository);

    const fromWalletId = '1';
    const fromInitialBalance = 200;
    const fromWallet = new Wallet({
      id: fromWalletId,
      currency: 'ARS',
      initialBalance: fromInitialBalance,
    });
    await walletRepository.save(fromWallet);

    await expect(
      transferUseCase.execute(fromWalletId, 'non-existing-id', 50),
    ).rejects.toThrow('Destination wallet not found');
  });
});
