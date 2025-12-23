import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('wallets')
export class WalletOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

 @Column({ name: 'user_id', type: 'uuid' })
 userId: string;        ;


  @Column('decimal', { precision: 18, scale: 2 })
  balance: string;

  @Column()
  currency: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;
}