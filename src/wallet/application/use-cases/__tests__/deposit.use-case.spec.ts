import { DepositUseCase } from '../deposit-use-case';
import { InMemoryWalletRepository } from '../../../infrastructure/persistence/in-memory-wallet.repository';
import { Wallet } from '../../../domain/entities/wallet.entity';
import { Money } from '../../../domain/value-objects/money';
import { Currency } from '../../../domain/value-objects/currency';

const UUID_WALLET = '550e8400-e29b-41d4-a716-446655440030';
const ARS = Currency.create('ARS');

describe('DepositUseCase', () => {
  it('should deposit amount into existing wallet', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const depositUseCase = new DepositUseCase(walletRepository);

    // First, create and store a wallet
    const initialBalance = new Money(100);
    const wallet = new Wallet({ id: UUID_WALLET, currency: ARS, initialBalance });
    await walletRepository.save(wallet);

    // Now, deposit an amount
    const depositAmount = new Money(50);
    const updatedWallet = await depositUseCase.execute(UUID_WALLET, depositAmount);

    expect(updatedWallet.getBalance().value).toBe(initialBalance.value + depositAmount.value);

    const storedWallet = await walletRepository.findById(UUID_WALLET);
    expect(storedWallet?.getBalance().value).toBe(initialBalance.value + depositAmount.value);
  });
});

describe('DepositUseCase with non-existing wallet', () => {
  it('should throw an error when wallet does not exist', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const depositUseCase = new DepositUseCase(walletRepository);

    const nonExistingUUID = '550e8400-e29b-41d4-a716-446655440078';
    await expect(
      depositUseCase.execute(nonExistingUUID, new Money(50)),
    ).rejects.toThrow('Wallet not found');
  });
});