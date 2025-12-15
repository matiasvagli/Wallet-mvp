import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletRepository } from '../../domain/repositories/wallet.repository';




export class PayUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(
    walletId: string,
    amount: number,
    targetWalletId?: string,
  ): Promise<Wallet> {
    const wallet = await this.walletRepository.findById(walletId);

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    wallet.pay(amount, targetWalletId);

    await this.walletRepository.save(wallet);

    return wallet;
  }
}
