/**
 * Value Object que representa una cantidad monetaria en centavos.
 *
 * Responsabilidades:
 * - Garantizar inmutabilidad de los valores monetarios
 * - Validar que los montos sean no negativos
 * - Proveer operaciones aritméticas seguras (suma, resta)
 * - Comparaciones precisas entre montos
 *
 * NO hace:
 * - Manejar conversiones de moneda (responsabilidad de Currency)
 * - Aplicar reglas de negocio específicas (responsabilidad de entidades)
 * - Formatear para presentación (responsabilidad de la UI)
 */
export class Money {
  private readonly cents: number;

  constructor(cents: number) {
    if (cents < 0) {
      throw new Error('Amount of money cannot be negative');
    }
    this.cents = cents;
  }

  add(amount: Money): Money {
    return new Money(this.cents + amount.cents);
  }

  

  equals(other: Money): boolean {
    return this.cents === other.cents;

  }

  isZeroOrNegative(): boolean {
    return this.cents <= 0;
  }

  isGreaterThan(other: Money): boolean {
    return this.cents > other.cents;
  }

  subtract(amount: Money): Money {
  if (amount.isGreaterThan(this)) {
    throw new Error('Insufficient funds');
  }
  return new Money(this.cents - amount.cents);
}


  get value(): number {
    return this.cents;
  }
}
