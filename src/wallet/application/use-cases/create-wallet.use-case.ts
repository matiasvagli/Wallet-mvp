import { Inject } from '@nestjs/common';

import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletType } from '../../domain/value-objects/wallet-type';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet-repository.token';
import type { WalletRepository } from '../../domain/repositories/wallet.repository';
import { WalletId } from '../../domain/value-objects/wallet-id';
import { Money } from '../../domain/value-objects/money';
import { Currency } from 'src/wallet/domain/value-objects/currency';
import { UserId } from '../../../user/domain/value-objects/user-id';

type CreateWalletInput = {
  userId: string;
  id: string;
  currency: Currency;
  initialBalance?: Money;
  type?: WalletType;
  parentWalletId?: string;
  perTransactionLimit?: Money;
  whitelistedWalletIds?: string[];
};

/**
 * Caso de uso responsable de crear una nueva Wallet.
 *
 * Responsabilidades:
 * - Orquestar la creación de la wallet
 * - Aplicar reglas de negocio entre agregados (por ejemplo, validación del padre para TEEN)
 * - Preparar datos válidos para el dominio
 * - Persistir la nueva wallet
 *
 * NO hace:
 * - Validar montos de dinero (responsabilidad del dominio)
 * - Decidir reglas de comportamiento de la wallet (responsabilidad del dominio)
 */
export class CreateWalletUseCase {
  constructor(
    // Repository injected by contract (implementation unknown here)
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: WalletRepository,
  ) {}

  /**
   * Crea una nueva wallet según el input proporcionado.
   *
   * Si el tipo de wallet es TEEN, se aplican reglas adicionales:
   * - Es obligatorio un wallet padre
   * - El wallet padre debe existir
   * - El wallet padre debe ser de tipo STANDARD
   */
  async execute(input: CreateWalletInput): Promise<Wallet> {
    const {
      userId,
      id,
      currency,
      initialBalance,
      type = WalletType.STANDARD,
      parentWalletId,
      perTransactionLimit,
      whitelistedWalletIds,
    } = input;

    // Cross-aggregate business rule:
    // A TEEN wallet can only be created if a valid parent wallet exists
    await this.ensureTeenWalletCanBeCreated(type, parentWalletId);

    // Create the Wallet entity.
    // - initialBalance defaults to 0 (valid state)
    // - perTransactionLimit is optional for TEEN wallets (undefined = no limit)
    const wallet = new Wallet({
      id,
      currency,
      initialBalance: initialBalance ?? new Money(0),
      type,
      teenRules:
        type === WalletType.TEEN
          ? {
              parentWalletId: parentWalletId!,
              perTransactionLimit, // optional → unlimited if undefined
            }
          : undefined,
    });

    // Persist the new wallet
    await this.walletRepository.save(wallet, UserId.create(userId));

    // Return the created entity
    return wallet;
  }

  /**
   * Ensures that a TEEN wallet can be created.
   *
   * Business rules enforced here:
   * - TEEN wallets must have a parent wallet
   * - Parent wallet must exist
   * - Parent wallet must be of type STANDARD
   *
   * This logic lives in the Use Case because it involves
   * multiple aggregates (Wallet ↔ Wallet).
   */
  private async ensureTeenWalletCanBeCreated(
    type: WalletType,
    parentWalletId?: string,
  ): Promise<void> {
    // No extra rules for non-TEEN wallets
    if (type !== WalletType.TEEN) return;

    if (!parentWalletId) {
      throw new Error('Teen wallet requires a parent wallet');
    }

    const parentWallet = await this.walletRepository.findById(
      WalletId.create(parentWalletId),
    );

    if (!parentWallet) {
      throw new Error('Parent wallet does not exist');
    }

    if (parentWallet.getType() !== WalletType.STANDARD) {
      throw new Error('Parent wallet must be a standard wallet');
    }
  }
}
