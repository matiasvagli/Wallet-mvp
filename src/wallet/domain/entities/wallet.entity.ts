import { WalletType } from '../value-objects/wallet-type';
import { WalletId } from '../value-objects/wallet-id';
import { Currency } from '../value-objects/currency';
import { Money } from '../value-objects/money';

type TeenRules = {
  parentWalletId: string;
  perTransactionLimit?: Money;
  whitelistedWalletIds?: string[];
};

type WalletProps = {
  id: string;
  currency: Currency;
  initialBalance?: Money;
  type?: WalletType;
  teenRules?: TeenRules;
};

export class Wallet {
  private readonly id: WalletId;
  private readonly currency: Currency;
  private balance: Money;
  private readonly type: WalletType;
  private readonly parentWalletId?: WalletId;
  private readonly perTransactionLimit?: Money;
  private readonly whitelistedWalletIds: Set<string>;

  constructor(props: WalletProps) {
    const {
      id,
      currency,
      initialBalance = new Money(0),
      type = WalletType.STANDARD,
      teenRules,
    } = props;

    

    this.id = WalletId.create(id);
    this.currency = currency;
    this.type = type;
    this.balance = initialBalance;

    if (type === WalletType.TEEN) {
      if (!teenRules) {
        throw new Error('Teen wallet requires teen rules');
      }

      if (
        teenRules.perTransactionLimit &&
        teenRules.perTransactionLimit.isZeroOrNegative()
      ) {
        throw new Error('Transaction limit must be positive');
      }

      this.parentWalletId = WalletId.create(teenRules.parentWalletId);
      this.perTransactionLimit = teenRules.perTransactionLimit;
      this.whitelistedWalletIds = new Set(teenRules.whitelistedWalletIds ?? []);
    } else {
      this.whitelistedWalletIds = new Set();
    }
  }

  getId(): string {
    return this.id.value;
  }

  getCurrency(): Currency {
    return this.currency;
  }

  getBalance(): Money {
    return this.balance;
  }

  getType(): WalletType {
    return this.type;
  }

  getParentWalletId(): string | undefined {
    return this.parentWalletId?.value;
  }

  deposit(amount: Money): void {
    if (amount.isZeroOrNegative()) {
      throw new Error('Deposit amount must be positive');
    }
    this.balance = this.balance.add(amount);
  }

  withdraw(amount: Money): void {
    if (amount.isZeroOrNegative()) {
      throw new Error('Withdrawal amount must be positive');
    }
    this.ensureSpendAllowed(amount);
    this.balance = this.balance.subtract(amount);
  }

  transfer(amount: Money, targetWallet: Wallet): void {
    if (amount.isZeroOrNegative()) {
      throw new Error('Transfer amount must be positive');
    }
    if (this.currency !== targetWallet.getCurrency()) {
      throw new Error('Currency mismatch between wallets');
    }
    this.ensureSpendAllowed(amount, WalletId.create(targetWallet.getId()), 'transfer');

    this.balance = this.balance.subtract(amount);
    targetWallet.deposit(amount);
  }

  pay(amount: Money, targetWalletId?: string): void {
    if (amount.isZeroOrNegative()) {
      throw new Error('Payment amount must be positive');
    }

    const walletIdObj = targetWalletId ? WalletId.create(targetWalletId) : undefined;
    this.ensureSpendAllowed(amount, walletIdObj, 'pay');
    this.balance = this.balance.subtract(amount);
  }



  private ensureSpendAllowed(
  amount: Money,
  targetWalletId?: WalletId,
  operation: 'withdraw' | 'transfer' | 'pay' = 'withdraw',
): void {
  if (amount.isGreaterThan(this.balance)) {
    throw new Error('Insufficient funds');
  }

  if (this.type === WalletType.TEEN) {
    if (
      this.perTransactionLimit &&
      amount.isGreaterThan(this.perTransactionLimit)
    ) {
      throw new Error('Amount exceeds per transaction limit');
    }

    if (
      targetWalletId &&
      this.whitelistedWalletIds.size > 0 &&
      !this.whitelistedWalletIds.has(targetWalletId.value)
    ) {
      throw new Error('Target wallet is not whitelisted');
    }
  }

  if (this.type === WalletType.STANDARD && operation === 'pay') {
    throw new Error('Pay operation only available for teen wallets');
  }
} 
}