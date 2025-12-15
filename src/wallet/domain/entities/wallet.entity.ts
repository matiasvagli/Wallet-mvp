import { WalletType } from '../value-objects/wallet-type';
type TeenRules = {
  parentWalletId: string;
  perTransactionLimit: number;
  whitelistedWalletIds?: string[];
};

type WalletProps = {
  id: string;
  currency: string;
  initialBalance?: number;
  type?: WalletType;
  teenRules?: TeenRules;
};

export class Wallet {
  private balance: number;
  private readonly type: WalletType;
  private readonly parentWalletId?: string;
  private readonly perTransactionLimit?: number;
  private readonly whitelistedWalletIds: Set<string>;

  constructor(props: WalletProps) {
    const {
      id,
      currency,
      initialBalance = 0,
      type = WalletType.STANDARD,
      teenRules,
    } = props;

    if (initialBalance < 0) {
      throw new Error('Initial balance cannot be negative');
    }

    if (type === WalletType.TEEN) {
      if (!teenRules) {
        throw new Error('Teen wallet requires teen rules');
      }
      if (teenRules.perTransactionLimit <= 0) {
        throw new Error('Transaction limit must be positive');
      }
      this.parentWalletId = teenRules.parentWalletId;
      this.perTransactionLimit = teenRules.perTransactionLimit;
      this.whitelistedWalletIds = new Set(teenRules.whitelistedWalletIds ?? []);
    } else {
      this.whitelistedWalletIds = new Set();
    }

    this.id = id;
    this.currency = currency;
    this.type = type;
    this.balance = initialBalance;
  }

  private readonly id: string;
  private readonly currency: string;

  getId(): string {
    return this.id;
  }

  getCurrency(): string {
    return this.currency;
  }

  getBalance(): number {
    return this.balance;
  }

  getType(): WalletType {
    return this.type;
  }

  getParentWalletId(): string | undefined {
    return this.parentWalletId;
  }

 

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }
    this.balance += amount;
  }

  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }
    this.ensureSpendAllowed(amount);
    this.balance -= amount;
  }
  
  transfer(amount: number, targetWallet: Wallet): void {
    if (amount <= 0) {
      throw new Error('Transfer amount must be positive');
    }
    if (this.currency !== targetWallet.getCurrency()) {
      throw new Error('Currency mismatch between wallets');
    }
    this.ensureSpendAllowed(amount, targetWallet.getId(), 'transfer');

    this.balance -= amount;
    targetWallet.deposit(amount);
  }

pay(amount: number, targetWalletId?: string): void {
  if (amount <= 0) {
    throw new Error('Payment amount must be positive');
  }

  this.ensureSpendAllowed(amount, targetWalletId, 'pay');
  this.balance -= amount;
}

private ensureSpendAllowed(
  amount: number,
  targetWalletId?: string,
  operation: 'withdraw' | 'transfer' | 'pay' = 'withdraw',
): void {
  // Regla comun 
  if (amount > this.balance) {
    throw new Error(
      operation === 'transfer'
        ? 'Insufficient funds for transfer'
        : 'Insufficient funds',
    );
  }

  // Reglas específicas TEEN
  if (this.type === WalletType.TEEN) {

    // Límite por operación
    if (this.perTransactionLimit && amount > this.perTransactionLimit) {
      throw new Error('Amount exceeds per transaction limit');
    }

    // Restricción: pay SOLO para teen
    if (operation === 'pay') {
      //  agregar reglas extra de pago teen si aparecen
      // por ahora, está permitido
    }

    // Restricción de whitelist
    if (
      targetWalletId &&
      this.whitelistedWalletIds.size > 0 &&
      !this.whitelistedWalletIds.has(targetWalletId)
    ) {
      throw new Error('Target wallet is not whitelisted for transfers');
    }
  }

  // Regla explícita: STANDARD no puede usar pay
  if (this.type === WalletType.STANDARD && operation === 'pay') {
    throw new Error('Pay operation only available for teen wallets');
  }
}
}