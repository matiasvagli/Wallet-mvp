import { Inject } from "@nestjs/common";
import { USER_REPOSITORY } from "../../domain/repositories/user-repository.token";
import type { UserRepository } from "../../domain/repositories/user-repository";
import { User } from "../../domain/entities/user/user.entity";
import { UserId } from "../../domain/value-objects/user-id";

type CreateUserInput = {    
    firstName: string;
    lastName: string;
    birthDate: Date;
};

export class CreateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(input: CreateUserInput): Promise<User> {
        // Generar UUID automáticamente
        const id = UserId.generate();
        
        const user = new User({ 
            id,
            firstName: input.firstName,
            lastName: input.lastName,
            birthDate: input.birthDate,
        });
        
        await this.userRepository.save(user);
        
        return user;
    }
}