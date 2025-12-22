import type { WalletRepository } from '../../domain/repositories/wallet.repository';
import { Inject } from '@nestjs/common';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet-repository.token';
import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletId } from '../../domain/value-objects/wallet-id';
import { Money } from '../../domain/value-objects/money';
import { BaseWalletUseCase } from './base-wallet-use-case';
import type { UserRepository } from '../../../user/domain/repositories/user-repository';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user-repository.token';
import { UserId } from '../../../user/domain/value-objects/user-id';


export class TransferUseCase extends BaseWalletUseCase {
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
    fromWalletId: string,
    toWalletId: string,
    amount: Money,
  ): Promise<{ fromWallet: Wallet; toWallet: Wallet }> {
    const user = await this.userRepository.findById(UserId.create(userId));
    if (!user) {
      throw new Error('User not found');
    }

    let fromWallet = await this.walletRepository.findById(
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

    // Auto-upgrade wallet if needed
    fromWallet = await this.maybeAutoUpgrade(fromWallet, user);

    fromWallet.transfer(amount, toWallet);

    await this.walletRepository.save(fromWallet);
    await this.walletRepository.save(toWallet);

    return { fromWallet, toWallet };
  }

}