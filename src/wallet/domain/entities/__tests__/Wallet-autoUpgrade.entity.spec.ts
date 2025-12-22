import { Wallet } from '../wallet.entity';
import { WalletType } from '../../value-objects/wallet-type';
import { Money } from '../../value-objects/money';
import { Currency } from '../../value-objects/currency';


describe('Wallet auto upgrade', () => {
  it('should upgrade teen wallet to standard', () => {
    const wallet = new Wallet({
      id: '550e8400-e29b-41d4-a716-446655440000',
      currency: Currency.ARS,
      initialBalance: new Money(100),
      type: WalletType.TEEN,
      teenRules: {
        parentWalletId: '550e8400-e29b-41d4-a716-446655440001',
      },
    });

    const upgraded = wallet.autoUpgrade();

    expect(upgraded.getType()).toBe(WalletType.STANDARD);
    expect(upgraded.getBalance().equals(new Money(100))).toBe(true);
    expect(upgraded.getParentWalletId()).toBeUndefined();
  });

  it('should throw error if wallet is not teen', () => {
    const wallet = new Wallet({
      id: '550e8400-e29b-41d4-a716-446655440002',
      currency: Currency.ARS,
      initialBalance: new Money(50),
      type: WalletType.STANDARD,
    });

    expect(() => wallet.autoUpgrade()).toThrow(
      'Only teen wallets can be upgraded',
    );
  });

  it('should allow auto upgrade only if teen and age >= 18', () => {
    const wallet = new Wallet({
      id: '550e8400-e29b-41d4-a716-446655440003',
      currency: Currency.ARS,
      type: WalletType.TEEN,
      teenRules: {
        parentWalletId: '550e8400-e29b-41d4-a716-446655440004',
      },
    });

    expect(wallet.canAutoUpgradeGivenAge(17)).toBe(false);
    expect(wallet.canAutoUpgradeGivenAge(18)).toBe(true);
  });
});