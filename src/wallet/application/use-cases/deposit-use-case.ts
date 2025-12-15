import { WalletRepository } from '../../domain/repositories/wallet.repository';
import { Wallet } from '../../domain/entities/wallet.entity';

export class DepositUseCase {
  constructor(
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(walletId: string, amount: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findById(walletId);

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    wallet.deposit(amount);

    await this.walletRepository.save(wallet);

    return wallet;
  }
}
