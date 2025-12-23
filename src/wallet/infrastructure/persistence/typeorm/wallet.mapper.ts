import { Wallet } from '../../../domain/entities/wallet.entity';
import { WalletOrmEntity } from './wallet.orm-entity';

import { Currency } from '../../../domain/value-objects/currency';
import { Money } from '../../../domain/value-objects/money';
import { WalletType } from '../../../domain/value-objects/wallet-type';


function decimalToCents(decimal: string): number {
  return Math.round(Number(decimal) * 100);
}


export class WalletMapper {
  static toOrm(wallet: Wallet, userId: string): WalletOrmEntity {
    const orm = new WalletOrmEntity();

    orm.id = wallet.getId();
    orm.userId = userId; // viene del use case
    orm.balance = wallet.getBalance().toString();
    orm.currency = wallet.getCurrency().value;
    orm.createdAt = new Date();

    return orm;
  }

  static toDomain(entity: WalletOrmEntity): Wallet {
  return new Wallet({
    id: entity.id,
    currency: Currency.create(entity.currency),
    initialBalance: new Money(decimalToCents(entity.balance)),
    type: WalletType.STANDARD,
  });
}

}
