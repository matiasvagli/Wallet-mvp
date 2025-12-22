import { Wallet } from '../wallet.entity';
import { WalletType } from '../../value-objects/wallet-type';
import { Money } from '../../value-objects/money';
import { Currency } from '../../value-objects/currency';

const ARS = Currency.create('ARS');

describe('Wallet - TEEN type', () => {
  const UUID_PARENT = '550e8400-e29b-41d4-a716-446655440000';
  const UUID_TEEN = '550e8400-e29b-41d4-a716-446655440001';

  function createTeenWallet(overrides?: Partial<{
    initialBalance: Money;
    perTransactionLimit: Money;
  }>) {
    return new Wallet({
      id: UUID_TEEN,
      currency: ARS,
      initialBalance: overrides?.initialBalance || new Money(10000),
      type: WalletType.TEEN,
      teenRules: {
        parentWalletId: UUID_PARENT,
        perTransactionLimit: overrides?.perTransactionLimit || new Money(5000),
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

});
