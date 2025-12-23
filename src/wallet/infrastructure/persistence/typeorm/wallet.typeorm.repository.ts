import { Repository } from 'typeorm';

import { WalletRepository } from '../../../domain/repositories/wallet.repository';
import { Wallet } from '../../../domain/entities/wallet.entity';

import { WalletOrmEntity } from './wallet.orm-entity';
import { WalletMapper } from './wallet.mapper';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { WalletId } from '../../../domain/value-objects/wallet-id';


export class WalletTypeOrmRepository implements WalletRepository {
  constructor(
    private readonly ormRepository: Repository<WalletOrmEntity>,
  ) {}

  async save(wallet: Wallet, userId: UserId): Promise<void> {
    const ormEntity = WalletMapper.toOrm(wallet, userId.value);
    await this.ormRepository.save(ormEntity);
  }

  async findById(id: WalletId): Promise<Wallet | null> {
  const entity = await this.ormRepository.findOneBy({
    id: id.value,
  });

  return entity ? WalletMapper.toDomain(entity) : null;
}

}
