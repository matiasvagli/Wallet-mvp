import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletRepository } from '../../domain/repositories/wallet.repository';
import { WalletType } from '../../domain/value-objects/wallet-type';

type CreateWalletInput = {
  id: string;
  currency: string;
  initialBalance?: number;
  type?: WalletType;
  parentWalletId?: string;
  perTransactionLimit?: number;
  whitelistedWalletIds?: string[];
};

export class CreateWalletUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(input: CreateWalletInput): Promise<Wallet> {
    const {
      id,
      currency,
      initialBalance = 0,
      type = WalletType.STANDARD,
      parentWalletId,
      perTransactionLimit,
      whitelistedWalletIds,
    } = input;

    const wallet = new Wallet({
      id,
      currency,
      initialBalance,
      type,
      teenRules:
        type === WalletType.TEEN
          ? {
              parentWalletId: parentWalletId ?? id,
              perTransactionLimit: perTransactionLimit ?? 0,
              whitelistedWalletIds,
            }
          : undefined,
    });

    await this.walletRepository.save(wallet);

    return wallet;
  }
}
