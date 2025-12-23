import { CreateWalletUseCase } from '../create-wallet.use-case';
import { InMemoryWalletRepository } from '../../../infrastructure/persistence/in-memory-wallet.repository';
import { WalletType } from '../../../domain/value-objects/wallet-type';
import { Money } from '../../../domain/value-objects/money';
import { Currency } from '../../../domain/value-objects/currency';
import { WalletId } from '../../../domain/value-objects/wallet-id';

const UUID_STD_1 = '550e8400-e29b-41d4-a716-446655440010';
const UUID_STD_2 = '550e8400-e29b-41d4-a716-446655440011';
const UUID_TEEN_1 = '550e8400-e29b-41d4-a716-446655440012';
const USER_ID = '550e8400-e29b-41d4-a716-446655440001';
const ARS = Currency.create('ARS');

describe('CreateWalletUseCase', () => {
  it('should create and store a standard wallet', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const createWalletUseCase = new CreateWalletUseCase(walletRepository);

    const wallet = await createWalletUseCase.execute({
      userId: USER_ID,
      id: UUID_STD_1,
      currency: ARS,
      initialBalance: new Money(100),
    });

    expect(wallet.getId()).toBe(UUID_STD_1);
    expect(wallet.getType()).toBe(WalletType.STANDARD);
    expect(wallet.getBalance().value).toBe(100);

    const storedWallet = await walletRepository.findById(WalletId.create(UUID_STD_1));
    expect(storedWallet).not.toBeNull();
    expect(storedWallet?.getType()).toBe(WalletType.STANDARD);
  });

  it('should not create a wallet with negative initial balance', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const createWalletUseCase = new CreateWalletUseCase(walletRepository);

    expect(() => {
      createWalletUseCase.execute({ userId: USER_ID, id: UUID_STD_2, currency: ARS, initialBalance: new Money(-10) });
    }).toThrow();

    const storedWallet = await walletRepository.findById(WalletId.create(UUID_STD_2));
    expect(storedWallet).toBeNull();
  });

  it('should reject creating TEEN wallet without existing STANDARD', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const createWalletUseCase = new CreateWalletUseCase(walletRepository);

    await expect(
      createWalletUseCase.execute({
        userId: USER_ID,
        id: UUID_TEEN_1,
        currency: ARS,
        initialBalance: new Money(150),
        type: WalletType.TEEN,
        parentWalletId: '550e8400-e29b-41d4-a716-446655440089',
        perTransactionLimit: new Money(100),
        whitelistedWalletIds: ['550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440061'],
      })
    ).rejects.toThrow('Parent wallet does not exist');
  });

  it('should create TEEN wallet when STANDARD exists', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const createWalletUseCase = new CreateWalletUseCase(walletRepository);

    // Primero crear STANDARD
    await createWalletUseCase.execute({
      userId: USER_ID,
      id: UUID_STD_1,
      currency: ARS,
      initialBalance: new Money(100),
      type: WalletType.STANDARD,
    });

    // Luego crear TEEN con ID diferente
    const teenWallet = await createWalletUseCase.execute({
      userId: USER_ID,
      id: UUID_TEEN_1,
      currency: ARS,
      initialBalance: new Money(150),
      type: WalletType.TEEN,
      parentWalletId: UUID_STD_1, // referencia al STANDARD
      perTransactionLimit: new Money(100),
      whitelistedWalletIds: ['550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440061'],
    });

    expect(teenWallet.getId()).toBe(UUID_TEEN_1);
    expect(teenWallet.getType()).toBe(WalletType.TEEN);
    expect(teenWallet.getParentWalletId()).toBe(UUID_STD_1);
  });
});