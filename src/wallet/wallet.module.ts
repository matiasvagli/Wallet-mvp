import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';

import { WalletController } from './infrastructure/controllers/wallet.controller';
import { CreateWalletUseCase } from './application/use-cases/create-wallet.use-case';

import { WalletOrmEntity } from './infrastructure/persistence/typeorm/wallet.orm-entity';
import { WalletTypeOrmRepository } from './infrastructure/persistence/typeorm/wallet.typeorm.repository';

import { WALLET_REPOSITORY } from './domain/repositories/wallet-repository.token';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletOrmEntity]),
  ],
  controllers: [WalletController],
  providers: [
    // Use cases
    CreateWalletUseCase,

    // Repository binding (TypeORM)
    {
      provide: WALLET_REPOSITORY,
      useFactory: (repo) => new WalletTypeOrmRepository(repo),
      inject: [getRepositoryToken(WalletOrmEntity)],
    },
  ],
})
export class WalletModule {}
