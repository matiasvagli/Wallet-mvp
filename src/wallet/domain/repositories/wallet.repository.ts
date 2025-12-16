import { Wallet } from '../entities/wallet.entity';
import { WalletId } from '../value-objects/wallet-id';


export interface WalletRepository {
  save(wallet: Wallet): Promise<void>;
  findById(id: WalletId): Promise<Wallet | null>;
}
