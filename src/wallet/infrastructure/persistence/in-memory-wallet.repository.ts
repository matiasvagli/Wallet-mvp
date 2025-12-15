import { WalletRepository } from '../../domain/repositories/wallet.repository';
import { Wallet } from '../../domain/entities/wallet.entity';

export class InMemoryWalletRepository implements WalletRepository {
  private wallets: Map<string, Wallet> = new Map();

  async save(wallet: Wallet): Promise<void> {
    this.wallets.set(wallet.getId(), wallet);
  }

  async findById(id: string): Promise<Wallet | null> {
    return this.wallets.get(id) ?? null;
  }
}
