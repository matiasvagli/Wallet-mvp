
// src/wallet/wallet.module.ts
import { Module } from '@nestjs/common';

import { WalletController } from './infrastructure/controllers/wallet.controller';

import { CreateWalletUseCase } from './application/use-cases/create-wallet.use-case';

import { InMemoryWalletRepository } from './infrastructure/persistence/in-memory-wallet.repository';

import { WALLET_REPOSITORY } from './domain/repositories/wallet-repository.token';

@Module({
  controllers: [WalletController],
  providers: [
    // Use cases
    CreateWalletUseCase,

    // Repository binding (DI)
    {
      provide: WALLET_REPOSITORY,
      useClass: InMemoryWalletRepository,
    },
  ],
})
export class WalletModule {}
