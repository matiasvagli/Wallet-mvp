import { WithdrawUseCase } from '../withdraw-use-case';
import { InMemoryWalletRepository } from '../../../infrastructure/persistence/in-memory-wallet.repository';
import { Wallet } from '../../../domain/entities/wallet.entity';
import { Money } from '../../../domain/value-objects/money';
import { Currency } from '../../../domain/value-objects/currency';

const UUID_WALLET = '550e8400-e29b-41d4-a716-446655440031';
const ARS = Currency.create('ARS');

describe('WithdrawUseCase', () => {
    it('should withdraw amount from existing wallet', async () => {
        const walletRepository = new InMemoryWalletRepository();
        const withdrawUseCase = new WithdrawUseCase(walletRepository);

        const initialBalance = new Money(100);
        const wallet = new Wallet({ id: UUID_WALLET, currency: ARS, initialBalance });
        await walletRepository.save(wallet);

        const withdrawAmount =new Money(40);
        const updatedWallet = await withdrawUseCase.execute(UUID_WALLET, withdrawAmount);
        expect(updatedWallet.getBalance().value).toBe(initialBalance.value - withdrawAmount.value);

        const storedWallet = await walletRepository.findById(UUID_WALLET);
        expect(storedWallet?.getBalance().value).toBe(initialBalance.value - withdrawAmount.value);
    });
}); 