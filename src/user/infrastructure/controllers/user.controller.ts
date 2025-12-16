import { Body, Controller, Patch, Post, Param } from '@nestjs/common';
import { CreateUserUseCase } from 'src/user/application/uses-cases/create-user-use-case';
import { UpdateUserNameUseCase } from 'src/user/application/uses-cases/update-user-name-use-case';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserNameUseCase: UpdateUserNameUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    const user = await this.createUserUseCase.execute({
      firstName: body.firstName,
      lastName: body.lastName,
      birthDate: new Date(body.birthDate),
    });

    return {
      id: user.getId().value,
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      birthDate: user.getBirthDate().toISOString().split('T')[0],
    };
  }

  @Patch('/:id/name')
  async updateName(
    @Param('id') id: string,              // 👈 viene del path
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
  ) {
    const user = await this.updateUserNameUseCase.execute({
      userId: id,                          // 👈 nombre correcto
      newFirstName: firstName,
      newLastName: lastName,
    });

    return {
      id: user.getId().value,
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      birthDate: user.getBirthDate().toISOString().split('T')[0],
    };
  }
}
