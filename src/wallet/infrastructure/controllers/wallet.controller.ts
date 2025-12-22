// src/wallet/infrastructure/controllers/wallet.controller.ts
import { Body, Controller, Patch, Post } from '@nestjs/common';

import { CreateWalletUseCase } from '../../application/use-cases/create-wallet.use-case';
import { WalletType } from '../../domain/value-objects/wallet-type';
import { Currency } from '../../domain/value-objects/currency';
import { Money } from '../../domain/value-objects/money';


type CreateWalletRequest = {
  id: string;
  currency: string;
  initialBalance?: number;

  // opcional
  type?: WalletType;

  // solo TEEN
  parentWalletId?: string;
  perTransactionLimit?: number;
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
      currency: Currency.create(body.currency),
      initialBalance: body.initialBalance ? new Money(body.initialBalance) : undefined,
      type: body.type,
      parentWalletId: body.parentWalletId,
      perTransactionLimit: body.perTransactionLimit ? new Money(body.perTransactionLimit) : undefined,
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
