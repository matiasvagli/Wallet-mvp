import { Controller, Post, Body } from '@nestjs/common';

import { CreateWalletUseCase } from '../../application/use-cases/create-wallet.use-case';
import { Money } from '../../domain/value-objects/money';
import { Currency } from '../../domain/value-objects/currency';
import { WalletType } from '../../domain/value-objects/wallet-type';

type CreateWalletDto = {
  id: string;
  currency: string;
  initialBalance?: number;
  type?: WalletType;
  parentWalletId?: string;
  perTransactionLimit?: number;
};

@Controller('wallets')
export class WalletController {
  constructor(
    private readonly createWalletUseCase: CreateWalletUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateWalletDto) {
    /**
     * TODO:
     * - Cuando implementemos Auth/JWT, el userId va a venir del token:
     *   req.user.id
     *
     * Por ahora usamos un placeholder explícito para no forzar el diseño.
     */
    const userId = 'TEMP_USER_ID';

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
}
