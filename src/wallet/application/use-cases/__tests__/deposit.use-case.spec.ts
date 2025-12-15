import { DepositUseCase } from '../deposit-use-case';
import { InMemoryWalletRepository } from '../../../infrastructure/persistence/in-memory-wallet.repository';
import { Wallet } from '../../../domain/entities/wallet.entity';


describe('DepositUseCase', () => {
  it('should deposit amount into existing wallet', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const depositUseCase = new DepositUseCase(walletRepository);

    // First, create and store a wallet
    const walletId = '1';
    const initialBalance = 100;
    const wallet = new Wallet({ id: walletId, currency: 'ARS', initialBalance });
    await walletRepository.save(wallet);

    // Now, deposit an amount
    const depositAmount = 50;
    const updatedWallet = await depositUseCase.execute(walletId, depositAmount);

    expect(updatedWallet.getBalance()).toBe(initialBalance + depositAmount);

    const storedWallet = await walletRepository.findById(walletId);
    expect(storedWallet?.getBalance()).toBe(initialBalance + depositAmount);
  });
});


describe('DepositUseCase with non-existing wallet', () => {
  it('should throw an error when wallet does not exist', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const depositUseCase = new DepositUseCase(walletRepository);

    await expect(
      depositUseCase.execute('non-existing-id', 50),
    ).rejects.toThrow('Wallet not found');
  });
});