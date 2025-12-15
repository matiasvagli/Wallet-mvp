import { WalletRepository } from '../../domain/repositories/wallet.repository';
import { Wallet } from '../../domain/entities/wallet.entity';


export class TransferUseCase {
  constructor(
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(
    fromWalletId: string,
    toWalletId: string,
    amount: number,
  ): Promise<{ fromWallet: Wallet; toWallet: Wallet }> {
    const fromWallet = await this.walletRepository.findById(fromWalletId);
    const toWallet = await this.walletRepository.findById(toWalletId);

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