import { Money } from 'src/wallet/domain/value-objects/money';
import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletRepository } from '../../domain/repositories/wallet.repository';
import { WalletId } from '../../domain/value-objects/wallet-id';




export class PayUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(
    walletId: string,
    amount: Money,
    targetWalletId?: string,
  ): Promise<Wallet> {
    const wallet = await this.walletRepository.findById(
      WalletId.create(walletId),
    );

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    wallet.pay(amount, targetWalletId);

    await this.walletRepository.save(wallet);

    return wallet;
  }
}
