import { Money } from '../money';

describe('Money Value Object', () => {
  it('should throw an error if initialized with a negative value', () => {
    expect(() => new Money(-100)).toThrow('Amount of money cannot be negative');
  });

  it('should add two Money instances correctly', () => {
    const money1 = new Money(1000);
    const money2 = new Money(500);

    const result = money1.add(money2);

    expect(result.equals(new Money(1500))).toBe(true);
  });

  it('should subtract two Money instances correctly', () => {
    const money1 = new Money(1000);
    const money2 = new Money(500);

    const result = money1.subtract(money2);

    expect(result.equals(new Money(500))).toBe(true);
  });

  it('should throw an error when subtracting more than the current amount', () => {
    const money1 = new Money(500);
    const money2 = new Money(1000);

    expect(() => money1.subtract(money2)).toThrow('Insufficient funds');
  });

  it('should compare two Money instances correctly with isGreaterThan', () => {
    const money1 = new Money(1000);
    const money2 = new Money(500);

    expect(money1.isGreaterThan(money2)).toBe(true);
    expect(money2.isGreaterThan(money1)).toBe(false);
  });

  it('should compare equality of two Money instances with equals', () => {
    const money1 = new Money(1000);
    const money2 = new Money(1000);
    const money3 = new Money(500);

    expect(money1.equals(money2)).toBe(true);
    expect(money1.equals(money3)).toBe(false);
  });
});