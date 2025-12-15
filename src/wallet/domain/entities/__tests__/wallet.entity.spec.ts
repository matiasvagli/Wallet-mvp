import { Wallet } from '../wallet.entity';
import { WalletType } from '../../value-objects/wallet-type';

describe('Wallet Entity', () => {
  it('crea una wallet estándar con saldo inicial', () => {
    const wallet = new Wallet({ id: '1', currency: 'ARS', initialBalance: 100 });

    expect(wallet.getBalance()).toBe(100);
    expect(wallet.getType()).toBe(WalletType.STANDARD);
  });

  it('no permite saldo inicial negativo', () => {
    expect(() => {
      new Wallet({ id: '1', currency: 'ARS', initialBalance: -10 });
    }).toThrow('Initial balance cannot be negative');
  });

  it('deposita dinero', () => {
    const wallet = new Wallet({ id: '1', currency: 'ARS', initialBalance: 100 });

    wallet.deposit(50);

    expect(wallet.getBalance()).toBe(150);
  });

  it('retira dinero', () => {
    const wallet = new Wallet({ id: '1', currency: 'ARS', initialBalance: 100 });

    wallet.withdraw(40);

    expect(wallet.getBalance()).toBe(60);
  });

  it('no permite retirar más que el saldo', () => {
    const wallet = new Wallet({ id: '1', currency: 'ARS', initialBalance: 100 });

    expect(() => wallet.withdraw(200)).toThrow('Insufficient funds');
  });

  it('no permite montos inválidos en depósito', () => {
    const wallet = new Wallet({ id: '1', currency: 'ARS' });

    expect(() => wallet.deposit(0)).toThrow('Deposit amount must be positive');
  });

  it('no permite monto de transferencia inválido', () => {
    const wallet1 = new Wallet({ id: '1', currency: 'ARS', initialBalance: 100 });
    const wallet2 = new Wallet({ id: '2', currency: 'ARS', initialBalance: 50 });

    expect(() => wallet1.transfer(0, wallet2)).toThrow('Transfer amount must be positive');
  });

  it('transfiere entre wallets estándar', () => {
    const wallet1 = new Wallet({ id: '1', currency: 'ARS', initialBalance: 100 });
    const wallet2 = new Wallet({ id: '2', currency: 'ARS', initialBalance: 50 });

    wallet1.transfer(30, wallet2);

    expect(wallet1.getBalance()).toBe(70);
    expect(wallet2.getBalance()).toBe(80);
  });

  it('no transfiere si falta saldo', () => {
    const wallet1 = new Wallet({ id: '1', currency: 'ARS', initialBalance: 100 });
    const wallet2 = new Wallet({ id: '2', currency: 'ARS', initialBalance: 50 });

    expect(() => wallet1.transfer(200, wallet2)).toThrow('Insufficient funds for transfer');
  });

  it('no transfiere entre monedas distintas', () => {
    const wallet1 = new Wallet({ id: '1', currency: 'ARS', initialBalance: 100 });
    const wallet2 = new Wallet({ id: '2', currency: 'USD', initialBalance: 50 });

    expect(() => wallet1.transfer(30, wallet2)).toThrow('Currency mismatch between wallets');
  });

  describe('Wallet TEEN', () => {
    const teenProps = {
      id: 'teen-1',
      currency: 'ARS',
      initialBalance: 200,
      type: WalletType.TEEN,
      teenRules: { parentWalletId: 'parent-1', perTransactionLimit: 150, whitelistedWalletIds: ['dest-1'] },
    };

    it('crea teen wallet con límites', () => {
      const wallet = new Wallet(teenProps);

      expect(wallet.getBalance()).toBe(200);
      expect(wallet.getType()).toBe(WalletType.TEEN);
      expect(wallet.getParentWalletId()).toBe('parent-1');
    });

    it('no permite pago que exceda el límite por transacción', () => {
      const wallet = new Wallet(teenProps);

      expect(() => wallet.pay(200, 'dest-1')).toThrow('Amount exceeds per transaction limit');
    });

    it('no permite transferir a destino no autorizado', () => {
      const wallet = new Wallet(teenProps);
      const target = new Wallet({ id: 'dest-2', currency: 'ARS', initialBalance: 0 });

      expect(() => wallet.transfer(50, target)).toThrow('Target wallet is not whitelisted for transfers');
    });

    it('permite transferir a destino whitelisted respetando límite', () => {
      const wallet = new Wallet(teenProps);
      const target = new Wallet({ id: 'dest-1', currency: 'ARS', initialBalance: 50 });

      wallet.transfer(100, target);

      expect(wallet.getBalance()).toBe(100);
      expect(target.getBalance()).toBe(150);
    });
  });
});