

export class Currency {
  private constructor(private readonly _value: string) {}

  static USD = new Currency('USD');
  static ARS = new Currency('ARS');


    static create(value: string): Currency {
    switch (value) {
      case 'USD':
        return Currency.USD;
      case 'ARS':
        return Currency.ARS;
      default:
        throw new Error('Invalid currency');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: Currency): boolean {
    return this._value === other._value;
  }
}