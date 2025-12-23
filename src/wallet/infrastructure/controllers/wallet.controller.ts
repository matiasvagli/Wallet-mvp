import { Controller, Post, Body, Param } from '@nestjs/common';

import { CreateWalletUseCase } from '../../application/use-cases/create-wallet.use-case';
import { DepositUseCase } from '../../application/use-cases/deposit-use-case';
import { WithdrawUseCase } from '../../application/use-cases/withdraw-use-case';

import { Currency } from '../../domain/value-objects/currency';
import { Money } from '../../domain/value-objects/money';
import { WalletType } from '../../domain/value-objects/wallet-type';

/* =======================
   DTOs (primitivos puros)
   ======================= */

type CreateWalletDto = {
  id: string;
  currency: string;
  initialBalance?: number;
  type?: WalletType;
  parentWalletId?: string;
  perTransactionLimit?: number;
};

type DepositDto = {
  amount: number;
};

type WithdrawDto = {
  amount: number;
};

/* =======================
   Controller
   ======================= */

@Controller('wallets')
export class WalletController {
  constructor(
    private readonly createWalletUseCase: CreateWalletUseCase,
    private readonly depositUseCase: DepositUseCase,
    private readonly withdrawUseCase: WithdrawUseCase,
  ) {}

  // POST /wallets
  @Post()
  async create(@Body() body: CreateWalletDto) {
    const userId = 'fake-user-id'; // placeholder consciente

    return this.createWalletUseCase.execute({
      userId,
      id: body.id,
      currency: Currency.create(body.currency),
      initialBalance:
        body.initialBalance !== undefined
          ? new Money(body.initialBalance)
          : undefined,
      type: body.type,
      parentWalletId: body.parentWalletId,
      perTransactionLimit:
        body.perTransactionLimit !== undefined
          ? new Money(body.perTransactionLimit)
          : undefined,
    });
  }

  // POST /wallets/:id/deposit
  @Post(':id/deposit')
  async deposit(
    @Param('id') walletId: string,
    @Body() body: DepositDto,
  ) {
    const userId = 'fake-user-id'; // placeholder consciente

    return this.depositUseCase.execute(
      walletId,
      userId,
      new Money(body.amount),
      
  );
  }

  // POST /wallets/:id/withdraw
  @Post(':id/withdraw')
  async withdraw(
    @Param('id') walletId: string,
    @Body() body: WithdrawDto,
  ) {
    const userId = 'fake-user-id'; // placeholder consciente

    return this.withdrawUseCase.execute(
      walletId,
      userId,
      new Money(body.amount),
    );
  }
}
