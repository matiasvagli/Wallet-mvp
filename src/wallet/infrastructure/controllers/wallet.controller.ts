// src/wallet/infrastructure/controllers/wallet.controller.ts
import { Body, Controller, Patch, Post } from '@nestjs/common';

import { CreateWalletUseCase } from '../../application/use-cases/create-wallet.use-case';
import { WalletType } from '../../domain/value-objects/wallet-type';


type CreateWalletRequest = {
  id: string;
  currency: string;
  initialBalance?: number;

  // opcional
  type?: WalletType;

  // solo TEEN
  parentWalletId?: string;
  perTransactionLimit?: number;
  whitelistedWalletIds?: string[];
};

@Controller('wallets')
export class WalletController {
  constructor(
    private readonly createWalletUseCase: CreateWalletUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateWalletRequest) {
    const wallet = await this.createWalletUseCase.execute({
      id: body.id,
      currency: body.currency,
      initialBalance: body.initialBalance,
      type: body.type,
      parentWalletId: body.parentWalletId,
      perTransactionLimit: body.perTransactionLimit,
      whitelistedWalletIds: body.whitelistedWalletIds,
    });

    // Respuesta HTTP (no devolvemos reglas internas)
    return {
      id: wallet.getId(),
      type: wallet.getType(),
      balance: wallet.getBalance(),
      currency: wallet.getCurrency(),
    };



  } 
}
