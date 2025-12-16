import { WithdrawUseCase } from '../withdraw-use-case';
import { InMemoryWalletRepository } from '../../../infrastructure/persistence/in-memory-wallet.repository';
import { Wallet } from '../../../domain/entities/wallet.entity';

const UUID_WALLET = '550e8400-e29b-41d4-a716-446655440031';

describe('WithdrawUseCase', () => {
    it('should withdraw amount from existing wallet', async () => {
        const walletRepository = new InMemoryWalletRepository();
        const withdrawUseCase = new WithdrawUseCase(walletRepository);

        const initialBalance = 100;
        const wallet = new Wallet({ id: UUID_WALLET, currency: 'ARS', initialBalance });
        await walletRepository.save(wallet);

        const withdrawAmount = 50;
        const updatedWallet = await withdrawUseCase.execute(UUID_WALLET, withdrawAmount);

        expect(updatedWallet.getBalance()).toBe(initialBalance - withdrawAmount);

        const storedWallet = await walletRepository.findById(UUID_WALLET);
        expect(storedWallet?.getBalance()).toBe(initialBalance - withdrawAmount);
    });
});