import type { WalletRepository } from '../../domain/repositories/wallet.repository';
import { Inject } from '@nestjs/common';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet-repository.token';
import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletId } from '../../domain/value-objects/wallet-id';
import { Money } from '../../domain/value-objects/money';

export class TransferUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(
    fromWalletId: string,
    toWalletId: string,
    amount: Money,
  ): Promise<{ fromWallet: Wallet; toWallet: Wallet }> {
    const fromWallet = await this.walletRepository.findById(
      WalletId.create(fromWalletId),
    );
    const toWallet = await this.walletRepository.findById(
      WalletId.create(toWalletId),
    );

    if (!fromWallet) {
      throw new Error('Source wallet not found');
    }

    if (!toWallet) {
      throw new Error('Destination wallet not found');
    }

    fromWallet.transfer(amount, toWallet);

    await this.walletRepository.save(fromWallet);
    await this.walletRepository.save(toWallet);

    return { fromWallet, toWallet };
  }
}   