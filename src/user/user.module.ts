import { Module } from '@nestjs/common';

import { UserController } from './infrastructure/controllers/user.controller';

import { CreateUserUseCase } from './application/uses-cases/create-user-use-case';
import { UpdateUserNameUseCase } from './application/uses-cases/update-user-name-use-case';

import { USER_REPOSITORY } from './domain/repositories/user-repository.token';
import { InMemoryUserRepository } from './infrastructure/persistence/in-memory-user.repository';

@Module({
  controllers: [
    UserController,
  ],
  providers: [
    // Use cases
    CreateUserUseCase,
    UpdateUserNameUseCase,

    // Repository binding (CLAVE)
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
