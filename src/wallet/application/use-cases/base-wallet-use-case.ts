import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletRepository } from '../../domain/repositories/wallet.repository';
import type { User } from '../../../user/domain/entities/user/user.entity';

export abstract class BaseWalletUseCase {
  constructor(
    protected readonly walletRepository: WalletRepository,
  ) {}

  protected maybeAutoUpgrade(
    wallet: Wallet,
    user: User,
  ): Wallet {
    const age = user.getAge(new Date());

    if (wallet.canAutoUpgradeGivenAge(age)) {
      return wallet.autoUpgrade();
    }

    return wallet;
  }
}
