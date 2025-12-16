import { CreateWalletUseCase } from '../create-wallet.use-case';
import { InMemoryWalletRepository } from '../../../infrastructure/persistence/in-memory-wallet.repository';
import { WalletType } from '../../../domain/value-objects/wallet-type';

const UUID_STD_1 = '550e8400-e29b-41d4-a716-446655440050';
const UUID_STD_2 = '550e8400-e29b-41d4-a716-446655440051';
const UUID_TEEN_1 = '550e8400-e29b-41d4-a716-446655440052';

describe('CreateWalletUseCase', () => {
  it('should create and store a standard wallet', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const createWalletUseCase = new CreateWalletUseCase(walletRepository);

    const wallet = await createWalletUseCase.execute({
      id: UUID_STD_1,
      currency: 'ARS',
      initialBalance: 100,
    });

    expect(wallet.getId()).toBe(UUID_STD_1);
    expect(wallet.getType()).toBe(WalletType.STANDARD);
    expect(wallet.getBalance()).toBe(100);

    const storedWallet = await walletRepository.findById(UUID_STD_1);
    expect(storedWallet).not.toBeNull();
    expect(storedWallet?.getType()).toBe(WalletType.STANDARD);
  });

  it('should not create a wallet with negative initial balance', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const createWalletUseCase = new CreateWalletUseCase(walletRepository);

    await expect(
      createWalletUseCase.execute({ id: UUID_STD_2, currency: 'ARS', initialBalance: -10 }),
    ).rejects.toThrow();

    const storedWallet = await walletRepository.findById(UUID_STD_2);
    expect(storedWallet).toBeNull();
  });

  it('should reject creating TEEN wallet without existing STANDARD', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const createWalletUseCase = new CreateWalletUseCase(walletRepository);

    await expect(
      createWalletUseCase.execute({
        id: UUID_TEEN_1,
        currency: 'ARS',
        initialBalance: 150,
        type: WalletType.TEEN,
        parentWalletId: '550e8400-e29b-41d4-a716-446655440089',
        perTransactionLimit: 100,
        whitelistedWalletIds: ['550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440061'],
      })
    ).rejects.toThrow('Parent wallet does not exist');
  });

  it('should create TEEN wallet when STANDARD exists', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const createWalletUseCase = new CreateWalletUseCase(walletRepository);

    // Primero crear STANDARD
    await createWalletUseCase.execute({
      id: UUID_STD_1,
      currency: 'ARS',
      initialBalance: 100,
      type: WalletType.STANDARD,
    });

    // Luego crear TEEN con ID diferente
    const teenWallet = await createWalletUseCase.execute({
      id: UUID_TEEN_1,
      currency: 'ARS',
      initialBalance: 150,
      type: WalletType.TEEN,
      parentWalletId: UUID_STD_1, // referencia al STANDARD
      perTransactionLimit: 100,
      whitelistedWalletIds: ['550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440061'],
    });

    expect(teenWallet.getId()).toBe(UUID_TEEN_1);
    expect(teenWallet.getType()).toBe(WalletType.TEEN);
    expect(teenWallet.getParentWalletId()).toBe(UUID_STD_1);
  });
});