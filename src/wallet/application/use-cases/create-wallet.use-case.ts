import { Inject } from '@nestjs/common';

import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletType } from '../../domain/value-objects/wallet-type';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet-repository.token';
import type { WalletRepository } from '../../domain/repositories/wallet.repository';
import { WalletId } from '../../domain/value-objects/wallet-id';

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
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: WalletRepository,
  ) {}

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

    //  Regla de negocio aislada 
    await this.ensureTeenWalletCanBeCreated(type, parentWalletId);

    const wallet = new Wallet({
      id,
      currency,
      initialBalance,
      type,
      teenRules:
        type === WalletType.TEEN
          ? {
              parentWalletId: parentWalletId!,
              perTransactionLimit: perTransactionLimit ?? 0,
              whitelistedWalletIds,
            }
          : undefined,
    });

    await this.walletRepository.save(wallet);

    return wallet;
  }

  // Guards de negocio 
  private async ensureTeenWalletCanBeCreated(
    type: WalletType,
    parentWalletId?: string,
  ): Promise<void> {
    if (type !== WalletType.TEEN) return;

    if (!parentWalletId) {
      throw new Error('Teen wallet requires a parent wallet');
    }

    const parentWallet = await this.walletRepository.findById(
      WalletId.create(parentWalletId),
    );

    if (!parentWallet) {
      throw new Error('Parent wallet does not exist');
    }

    if (parentWallet.getType() !== WalletType.STANDARD) {
      throw new Error('Parent wallet must be a standard wallet');
    }
  }
}
