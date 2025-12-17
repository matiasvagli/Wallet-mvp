import { Wallet } from '../wallet.entity';
import { WalletType } from '../../value-objects/wallet-type';
import { Money } from '../../value-objects/money';
import { Currency } from '../../value-objects/currency';

const ARS = Currency.create('ARS');
const USD = Currency.create('USD');

describe('Wallet - STANDARD type', () => {
  const UUID_WALLET_1 = '550e8400-e29b-41d4-a716-446655440000';
  const UUID_WALLET_2 = '550e8400-e29b-41d4-a716-446655440001';

  it('should create a standard wallet with initial balance', () => {
    const wallet = new Wallet({
      id: UUID_WALLET_1,
      currency: ARS,
      initialBalance: new Money(10000),
    });

    expect(wallet.getBalance().value).toBe(10000);
    expect(wallet.getType()).toBe(WalletType.STANDARD);
    expect(wallet.getCurrency()).toBe(ARS);
  });

  it('should create a standard wallet with zero balance by default', () => {
    const wallet = new Wallet({
      id: UUID_WALLET_1,
      currency: ARS,
      initialBalance: new Money(0), // Saldo 0 es válido
    });

    expect(wallet.getBalance().value).toBe(0);
    expect(wallet.getType()).toBe(WalletType.STANDARD);
  });

  it('should not allow negative initial balance', () => {
    expect(() => {
      new Wallet({
        id: UUID_WALLET_1,
        currency: ARS,
        initialBalance: new Money(-100),
      });
    }).toThrow('Amount of money cannot be negative');
  });

  it('should deposit money successfully', () => {
    const wallet = new Wallet({
      id: UUID_WALLET_1,
      currency: ARS,
      initialBalance: new Money(10000),
    });

    wallet.deposit(new Money(5000));

    expect(wallet.getBalance().value).toBe(15000);
  });

  it('should not allow zero or negative deposits', () => {
    const wallet = new Wallet({
      id: UUID_WALLET_1,
      currency: ARS,
      initialBalance: new Money(10000),
    });

    expect(() => wallet.deposit(new Money(0))).toThrow('Deposit amount must be positive');
  });

  it('should withdraw money successfully', () => {
    const wallet = new Wallet({
      id: UUID_WALLET_1,
      currency: ARS,
      initialBalance: new Money(10000),
    });

    wallet.withdraw(new Money(3000));

    expect(wallet.getBalance().value).toBe(7000);
  });

  it('should not allow withdrawal exceeding balance', () => {
    const wallet = new Wallet({
      id: UUID_WALLET_1,
      currency: ARS,
      initialBalance: new Money(10000),
    });

    expect(() => wallet.withdraw(new Money(15000))).toThrow('Insufficient funds');
  });

  it('should not allow zero or negative withdrawals', () => {
    const wallet = new Wallet({
      id: UUID_WALLET_1,
      currency: ARS,
      initialBalance: new Money(10000),
    });

    expect(() => wallet.withdraw(new Money(0))).toThrow('Withdrawal amount must be positive');
  });

  it('should transfer money between wallets with same currency', () => {
    const wallet1 = new Wallet({
      id: UUID_WALLET_1,
      currency: ARS,
      initialBalance: new Money(10000),
    });

    const wallet2 = new Wallet({
      id: UUID_WALLET_2,
      currency: ARS,
      initialBalance: new Money(5000),
    });

    wallet1.transfer(new Money(3000), wallet2);

    expect(wallet1.getBalance().value).toBe(7000);
    expect(wallet2.getBalance().value).toBe(8000);
  });

  it('should not allow transfer between wallets with different currencies', () => {
    const wallet1 = new Wallet({
      id: UUID_WALLET_1,
      currency: ARS,
      initialBalance: new Money(10000),
    });

    const wallet2 = new Wallet({
      id: UUID_WALLET_2,
      currency: USD,
      initialBalance: new Money(5000),
    });

    expect(() => wallet1.transfer(new Money(3000), wallet2)).toThrow('Currency mismatch between wallets');
  });

  it('should not allow transfer exceeding balance', () => {
    const wallet1 = new Wallet({
      id: UUID_WALLET_1,
      currency: ARS,
      initialBalance: new Money(10000),
    });

    const wallet2 = new Wallet({
      id: UUID_WALLET_2,
      currency: ARS,
      initialBalance: new Money(5000),
    });

    expect(() => wallet1.transfer(new Money(15000), wallet2)).toThrow('Insufficient funds');
  });

  it('should not allow zero or negative transfers', () => {
    const wallet1 = new Wallet({
      id: UUID_WALLET_1,
      currency: ARS,
      initialBalance: new Money(10000),
    });

    const wallet2 = new Wallet({
      id: UUID_WALLET_2,
      currency: ARS,
      initialBalance: new Money(5000),
    });

    expect(() => wallet1.transfer(new Money(0), wallet2)).toThrow('Transfer amount must be positive');
  });

  it('should not allow pay operation for standard wallets', () => {
    const wallet = new Wallet({
      id: UUID_WALLET_1,
      currency: ARS,
      initialBalance: new Money(10000),
    });

    expect(() => wallet.pay(new Money(1000), UUID_WALLET_2)).toThrow('Pay operation only available for teen wallets');
  });
});
