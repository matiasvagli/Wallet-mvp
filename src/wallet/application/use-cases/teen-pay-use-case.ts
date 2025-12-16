import { Wallet } from '../../domain/entities/wallet.entity';
import type { WalletRepository } from '../../domain/repositories/wallet.repository';
import { Inject } from '@nestjs/common';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet-repository.token';
import { WalletId } from '../../domain/value-objects/wallet-id';

export class TeenPayUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(
    teenWalletId: string,
    amount: number,
    targetWalletId?: string,
  ): Promise<Wallet> {
    const teenWallet = await this.walletRepository.findById(
      WalletId.create(teenWalletId),
    );

    if (!teenWallet) {
      throw new Error('Teen wallet not found');
    }

    teenWallet.pay(amount, targetWalletId);

    await this.walletRepository.save(teenWallet);

    return teenWallet;
  }
}
