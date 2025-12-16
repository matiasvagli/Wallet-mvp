import { WalletRepository } from '../../domain/repositories/wallet.repository';
import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletId } from '../../domain/value-objects/wallet-id';

export class InMemoryWalletRepository implements WalletRepository {
  private wallets: Map<string, Wallet> = new Map();

  async save(wallet: Wallet): Promise<void> {
    this.wallets.set(wallet.getId(), wallet);
  }

  async findById(id: WalletId): Promise<Wallet | null>;
  async findById(id: string): Promise<Wallet | null>;
  async findById(id: string | WalletId): Promise<Wallet | null> {
    const key = typeof id === 'string' ? id : id.value;
    return this.wallets.get(key) ?? null;
  }
}
