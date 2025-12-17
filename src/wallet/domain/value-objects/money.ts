
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
