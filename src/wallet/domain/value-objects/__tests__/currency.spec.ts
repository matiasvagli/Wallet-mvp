import { Currency } from '../currency';

describe('Currency Value Object', () => {
  it('should create a valid currency', () => {
    const currency = Currency.create('USD');
    expect(currency.equals(Currency.USD)).toBe(true);
  });

  it('should throw an error for an invalid currency', () => {
    expect(() => Currency.create('INVALID')).toThrow('Invalid currency');
  });
});
