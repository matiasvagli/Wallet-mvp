import { Wallet } from '../entities/wallet.entity';

export interface WalletRepository {
  save(wallet: Wallet): Promise<void>;
  findById(id: string): Promise<Wallet | null>;
}
