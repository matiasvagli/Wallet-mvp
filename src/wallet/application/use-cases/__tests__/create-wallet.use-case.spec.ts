import { CreateWalletUseCase } from '../create-wallet.use-case';
import { InMemoryWalletRepository } from '../../../infrastructure/persistence/in-memory-wallet.repository';
import { WalletType } from '../../../domain/value-objects/wallet-type';




describe('CreateWalletUseCase for standard', () => {
  it('should create and store a standard wallet', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const createWalletUseCase = new CreateWalletUseCase(walletRepository);

    const wallet = await createWalletUseCase.execute({
      id: 'std-1',
      currency: 'ARS',
      initialBalance: 100,
    });

    expect(wallet.getId()).toBe('std-1');
    expect(wallet.getType()).toBe(WalletType.STANDARD);
    expect(wallet.getBalance()).toBe(100);

    const storedWallet = await walletRepository.findById('std-1');
    expect(storedWallet).not.toBeNull();
    expect(storedWallet?.getType()).toBe(WalletType.STANDARD);
  });





describe('CreateWalletUseCase for teen', () => {
  it('should create and store a teen wallet', async () => {
    const walletRepository = new InMemoryWalletRepository();
    const createWalletUseCase = new CreateWalletUseCase(walletRepository);

    const teenWallet = await createWalletUseCase.execute({
      id: 'teen-1',
      currency: 'ARS',
      initialBalance: 150,
      type: WalletType.TEEN,
      parentWalletId: 'parent-1',
      perTransactionLimit: 100,
      whitelistedWalletIds: ['wallet-1', 'wallet-2'],
    });

    // Identidad y tipo
    expect(teenWallet.getId()).toBe('teen-1');
    expect(teenWallet.getType()).toBe(WalletType.TEEN);
    expect(teenWallet.getBalance()).toBe(150);

    // Comportamiento (no estructura)
    expect(() => teenWallet.pay(90)).not.toThrow();
    expect(() => teenWallet.pay(150)).toThrow();

    // Persistencia
    const storedWallet = await walletRepository.findById('teen-1');
    expect(storedWallet).not.toBeNull();
    expect(storedWallet?.getType()).toBe(WalletType.TEEN);
  });
})  ;
});
