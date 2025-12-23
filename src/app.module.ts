import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'wallet',
      autoLoadEntities: true,
      synchronize: true, // SOLO DEV
    }),
    WalletModule,
    UserModule,AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
