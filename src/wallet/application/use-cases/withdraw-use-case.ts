import type { WalletRepository } from '../../domain/repositories/wallet.repository';
import { Inject } from '@nestjs/common';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet-repository.token';
import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletId } from '../../domain/value-objects/wallet-id';
import { Money } from '../../domain/value-objects/money';
import type { UserRepository } from '../../../user/domain/repositories/user-repository';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user-repository.token';
import { UserId } from '../../../user/domain/value-objects/user-id';
import { BaseWalletUseCase } from './base-wallet-use-case';


export class WithdrawUseCase extends BaseWalletUseCase {
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
    walletId: string,
    amount: Money,
  ): Promise<Wallet> {

    const user = await this.userRepository.findById(UserId.create(userId));
    if (!user) {
      throw new Error('User not found');
    }

    let wallet = await this.walletRepository.findById(
      WalletId.create(walletId),
    );
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    
    wallet.withdraw(amount);
    await this.walletRepository.save(wallet,UserId.create(userId));

    //  trigger lazy
    wallet = await this.maybeAutoUpgrade(wallet, user);

    return wallet;
  }

 
}
