import type { WalletRepository } from '../../domain/repositories/wallet.repository';
import { Inject } from '@nestjs/common';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet-repository.token';
import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletId } from '../../domain/value-objects/wallet-id';


export class WithdrawUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(walletId: string, amount: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findById(
      WalletId.create(walletId),
    );

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    wallet.withdraw(amount);

    await this.walletRepository.save(wallet);

    return wallet;
  }
}