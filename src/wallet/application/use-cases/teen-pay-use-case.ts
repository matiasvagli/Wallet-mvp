import { Wallet } from '../../domain/entities/wallet.entity';
import type { WalletRepository } from '../../domain/repositories/wallet.repository';
import { Inject } from '@nestjs/common';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet-repository.token';
import { WalletId } from '../../domain/value-objects/wallet-id';
import { Money } from '../../domain/value-objects/money';
import { BaseWalletUseCase } from './base-wallet-use-case';
import type { UserRepository } from '../../../user/domain/repositories/user-repository';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user-repository.token';
import { UserId } from '../../../user/domain/value-objects/user-id';


export class TeenPayUseCase extends BaseWalletUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY)
    protected readonly walletRepository: WalletRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {
    super(walletRepository);
  }

  async execute(
    userId: string,
    teenWalletId: string,
    amount: Money,
    targetWalletId?: string,
  ): Promise<Wallet> {
    const user = await this.userRepository.findById(UserId.create(userId));
    if (!user) {
      throw new Error('User not found');
    }

    let teenWallet = await this.walletRepository.findById(
      WalletId.create(teenWalletId),
    );

    if (!teenWallet) {
      throw new Error('Teen wallet not found');
    }

    teenWallet.pay(amount, targetWalletId);

    await this.walletRepository.save(teenWallet);

    teenWallet = await this.maybeAutoUpgrade(teenWallet, user);

    return teenWallet;
  }
}
