import { Wallet } from '../wallet.entity';
import { WalletType } from '../../value-objects/wallet-type';
import { Money } from '../../value-objects/money';
import { Currency } from '../../value-objects/currency';

const ARS = Currency.create('ARS');

describe('Wallet - TEEN type', () => {
  const UUID_PARENT = '550e8400-e29b-41d4-a716-446655440000';
  const UUID_TEEN = '550e8400-e29b-41d4-a716-446655440001';
  const UUID_WHITELISTED_1 = '550e8400-e29b-41d4-a716-446655440002';
  const UUID_WHITELISTED_2 = '550e8400-e29b-41d4-a716-446655440003';
  const UUID_NOT_WHITELISTED = '550e8400-e29b-41d4-a716-446655440004';

  function createTeenWallet(overrides?: Partial<{
    initialBalance: Money;
    perTransactionLimit: Money;
    whitelistedWalletIds: string[];
  }>) {
    return new Wallet({
      id: UUID_TEEN,
      currency: ARS,
      initialBalance: overrides?.initialBalance || new Money(10000),
      type: WalletType.TEEN,
      teenRules: {
        parentWalletId: UUID_PARENT,
        perTransactionLimit: overrides?.perTransactionLimit || new Money(5000),
        whitelistedWalletIds: overrides?.whitelistedWalletIds || [UUID_WHITELISTED_1, UUID_WHITELISTED_2],
      },
    });
  }

  it('should create a teen wallet with correct properties', () => {
    const teenWallet = createTeenWallet();

    expect(teenWallet.getType()).toBe(WalletType.TEEN);
    expect(teenWallet.getBalance().value).toBe(10000);
    expect(teenWallet.getParentWalletId()).toBe(UUID_PARENT);
  });

  it('should require teen rules when creating a teen wallet', () => {
    expect(() => {
      new Wallet({
        id: UUID_TEEN,
        currency: ARS,
        initialBalance: new Money(10000),
        type: WalletType.TEEN,
      });
    }).toThrow('Teen wallet requires teen rules');
  });

  it('should require positive transaction limit', () => {
    expect(() => {
      new Wallet({
        id: UUID_TEEN,
        currency: ARS,
        initialBalance: new Money(10000),
        type: WalletType.TEEN,
        teenRules: {
          parentWalletId: UUID_PARENT,
          perTransactionLimit: new Money(0),
          whitelistedWalletIds: [UUID_WHITELISTED_1],
        },
      });
    }).toThrow('Transaction limit must be positive');
  });

  it('should deposit money successfully', () => {
    const teenWallet = createTeenWallet();

    teenWallet.deposit(new Money(3000));

    expect(teenWallet.getBalance().value).toBe(13000);
  });

  it('should withdraw money within limit', () => {
    const teenWallet = createTeenWallet();

    teenWallet.withdraw(new Money(4000));

    expect(teenWallet.getBalance().value).toBe(6000);
  });

  it('should not allow withdrawal exceeding per transaction limit', () => {
    const teenWallet = createTeenWallet({
      initialBalance: new Money(10000),
      perTransactionLimit: new Money(3000),
    });

    expect(() => teenWallet.withdraw(new Money(5000))).toThrow('Amount exceeds per transaction limit');
  });

  it('should not allow withdrawal exceeding balance', () => {
    const teenWallet = createTeenWallet({
      initialBalance: new Money(10000),
    });

    expect(() => teenWallet.withdraw(new Money(15000))).toThrow('Insufficient funds');
  });

  it('should transfer to whitelisted wallet within limit', () => {
    const teenWallet = createTeenWallet();
    const targetWallet = new Wallet({
      id: UUID_WHITELISTED_1,
      currency: ARS,
      initialBalance: new Money(0), // Saldo 0 es válido
      type: WalletType.STANDARD,
    });

    teenWallet.transfer(new Money(3000), targetWallet);

    expect(teenWallet.getBalance().value).toBe(7000);
    expect(targetWallet.getBalance().value).toBe(3000);
  });

  it('should not allow transfer to non-whitelisted wallet', () => {
    const teenWallet = createTeenWallet();
    const targetWallet = new Wallet({
      id: UUID_NOT_WHITELISTED,
      currency: ARS,
      initialBalance: new Money(1),
      type: WalletType.STANDARD, // Tipo estándar para evitar reglas TEEN
    });

    expect(() => teenWallet.transfer(new Money(3000), targetWallet)).toThrow('Target wallet is not whitelisted');
  });

  it('should not allow transfer exceeding per transaction limit', () => {
    const teenWallet = createTeenWallet({
      initialBalance: new Money(10000),
      perTransactionLimit: new Money(2000),
    });
    const targetWallet = new Wallet({
      id: UUID_WHITELISTED_1,
      currency: ARS,
      initialBalance: new Money(0), // Saldo 0 es válido
      type: WalletType.STANDARD,
    });

    expect(() => teenWallet.transfer(new Money(3000), targetWallet)).toThrow('Amount exceeds per transaction limit');
  });

  it('should allow transfer to any wallet when whitelist is empty', () => {
    const teenWallet = createTeenWallet({
      whitelistedWalletIds: [],
    });
    const targetWallet = new Wallet({
      id: UUID_NOT_WHITELISTED,
      currency: ARS,
      initialBalance: new Money(0), // Saldo 0 es válido
      type: WalletType.STANDARD,
    });

    teenWallet.transfer(new Money(3000), targetWallet);

    expect(teenWallet.getBalance().value).toBe(7000);
    expect(targetWallet.getBalance().value).toBe(3000);
  });

  it('should pay to whitelisted wallet within limit', () => {
    const teenWallet = createTeenWallet();

    teenWallet.pay(new Money(3000), UUID_WHITELISTED_1);

    expect(teenWallet.getBalance().value).toBe(7000);
  });

  it('should not allow pay exceeding per transaction limit', () => {
    const teenWallet = createTeenWallet({
      initialBalance: new Money(10000),
      perTransactionLimit: new Money(2000),
    });

    expect(() => teenWallet.pay(new Money(3000), UUID_WHITELISTED_1)).toThrow('Amount exceeds per transaction limit');
  });

  it('should not allow pay to non-whitelisted wallet', () => {
    const teenWallet = createTeenWallet();

    expect(() => teenWallet.pay(new Money(1000), UUID_NOT_WHITELISTED)).toThrow('Target wallet is not whitelisted');
  });

  it('should not allow pay exceeding balance', () => {
    const teenWallet = createTeenWallet({
      initialBalance: new Money(10000),
    });

    expect(() => teenWallet.pay(new Money(15000), UUID_WHITELISTED_1)).toThrow('Insufficient funds');
  });

  it('should allow pay to any wallet when whitelist is empty', () => {
    const teenWallet = createTeenWallet({
      whitelistedWalletIds: [],
    });

    teenWallet.pay(new Money(3000), UUID_NOT_WHITELISTED);

    expect(teenWallet.getBalance().value).toBe(7000);
  });

  it('should not allow zero or negative pay amounts', () => {
    const teenWallet = createTeenWallet();

    expect(() => teenWallet.pay(new Money(0), UUID_WHITELISTED_1)).toThrow('Payment amount must be positive');
  });
});
