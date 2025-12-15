import { WithdrawUseCase } from '../withdraw-use-case';
import { InMemoryWalletRepository } from '../../../infrastructure/persistence/in-memory-wallet.repository';
import { Wallet } from '../../../domain/entities/wallet.entity';

describe('WithdrawUseCase', () => {
    it('should withdraw amount from existing wallet', async () => {
        const walletRepository = new InMemoryWalletRepository();
        const withdrawUseCase = new WithdrawUseCase(walletRepository);

        const walletId = '1';
        const initialBalance = 100;
        const wallet = new Wallet({ id: walletId, currency: 'ARS', initialBalance });
        await walletRepository.save(wallet);

        const withdrawAmount = 50;
        const updatedWallet = await withdrawUseCase.execute(walletId, withdrawAmount);

        expect(updatedWallet.getBalance()).toBe(initialBalance - withdrawAmount);

        const storedWallet = await walletRepository.findById(walletId);
        expect(storedWallet?.getBalance()).toBe(initialBalance - withdrawAmount);
    });
});