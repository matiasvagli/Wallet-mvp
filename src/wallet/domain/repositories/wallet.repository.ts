import { Wallet } from '../entities/wallet.entity';
import { WalletId } from '../value-objects/wallet-id';
import { UserId } from '../../../user/domain/value-objects/user-id';


export interface WalletRepository {
  save(wallet: Wallet, userId: UserId): Promise<void>;
  findById(id: WalletId): Promise<Wallet | null>;
}
