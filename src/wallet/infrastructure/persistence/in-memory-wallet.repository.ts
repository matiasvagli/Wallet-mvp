import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletRepository } from '../../domain/repositories/wallet.repository';
import { WalletId } from '../../domain/value-objects/wallet-id';
import { UserId } from '../../../user/domain/value-objects/user-id';

export class InMemoryWalletRepository implements WalletRepository {
  private wallets: Map<string, Wallet> = new Map();

  async save(wallet: Wallet, userId: UserId): Promise<void> {
    
    this.wallets.set(wallet.getId(), wallet);
  }

  async findById(id: WalletId): Promise<Wallet | null> {
    return this.wallets.get(id.value) ?? null;
  }

  
  clear(): void {
    this.wallets.clear();
  }
}
