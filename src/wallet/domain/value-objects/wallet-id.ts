import { randomUUID } from 'crypto';

export class WalletId {
  private constructor(private readonly _value: string) {}

  static create(value: string): WalletId {
    if (!WalletId.isValidUUID(value)) {
      throw new Error('Invalid WalletId');
    }
    return new WalletId(value);
  }

  static generate(): WalletId {
    return new WalletId(randomUUID());
  }

  get value(): string {
    return this._value;
  }

  equals(other: WalletId): boolean {
    return this._value === other._value;
  }

  private static isValidUUID(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }
}
