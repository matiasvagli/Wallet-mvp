import { randomUUID } from 'crypto';

export class UserId {
  private constructor(private readonly _value: string) {}

  static create(value: string): UserId {
    if (!UserId.isValidUUID(value)) {
      throw new Error('Invalid UserId');
    }
    return new UserId(value);
  }

  static generate(): UserId {
    return new UserId(randomUUID());
  }

  get value(): string {
    return this._value;
  }

  equals(other: UserId): boolean {
    return this._value === other._value;
  }

  private static isValidUUID(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }
}
