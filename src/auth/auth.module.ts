import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { LoginUseCase } from './application/use-cases/login-use-case';
import { RegisterUseCase } from './application/use-cases/register-use-case';

import { AuthController } from './infrastructure/controllers/auth.controller';

import { JwtStrategy } from './infrastructure/security/jwt/jwt.strategy';
import { JwtTokenService } from './infrastructure/security/jwt/jwt-token.service';

import { TOKEN_SERVICE } from './domain/services/token-service.token';
import { PASSWORD_HASHER } from './domain/services/password-hasher.token';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt/password-hasher';
import { AUTH_REPOSITORY } from './domain/repositories/auth-repository.token';
import { InMemoryAuthUserRepository } from './infrastructure/persistence/in-memory-auth.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use cases
    LoginUseCase,
    RegisterUseCase,

    // JWT
    JwtStrategy,
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
    // Password hasher
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    // Auth repository binding (in-memory for now)
    {
      provide: AUTH_REPOSITORY,
      useClass: InMemoryAuthUserRepository,
    },
  ],
  exports: [TOKEN_SERVICE, PASSWORD_HASHER, AUTH_REPOSITORY],
})
export class AuthModule {}
