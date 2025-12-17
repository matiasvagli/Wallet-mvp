import type { WalletRepository } from '../../domain/repositories/wallet.repository';
import { Inject } from '@nestjs/common';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet-repository.token';
import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletId } from '../../domain/value-objects/wallet-id';
import { Money } from '../../domain/value-objects/money';

export class DepositUseCase {
  constructor(
    // Inyectamos el repositorio por contrato (no conocemos la implementación)
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: WalletRepository,
  ) {}

  /**
   * Orquesta un depósito de dinero en una wallet existente.
   *
   * Responsabilidades del Use Case:
   * - Buscar la wallet
   * - Validar que exista
   * - Delegar la regla de negocio al dominio (wallet.deposit)
   * - Persistir el nuevo estado
   *
   * NO valida montos (eso es responsabilidad del dominio).
   */
  async execute(walletId: string, amount: Money): Promise<Wallet> {
    // Convertimos el string en un Value Object de identidad
    // (no crea una wallet, solo encapsula y valida el ID)
    const wallet = await this.walletRepository.findById(
      WalletId.create(walletId),
    );

    // Si la wallet no existe, el caso de uso falla
    // (no se crean entidades implícitamente)
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Delegamos la regla de negocio a la entidad
    // La wallet decide si el depósito es válido o no
    wallet.deposit(amount);

    // Persistimos el nuevo estado de la wallet
    await this.walletRepository.save(wallet);

    // Retornamos la entidad actualizada
    return wallet;
  }
}
