import { Inject } from "@nestjs/common";
import { USER_REPOSITORY } from "../../domain/repositories/user-repository.token";
import type { UserRepository } from "../../domain/repositories/user-repository";
import { User } from "../../domain/entities/user/user.entity";
import { UserId } from "../../domain/value-objects/user-id";


type UpdateUserNameInput = {    
    userId: string;
    newFirstName: string;
    newLastName: string;
};

export class UpdateUserNameUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(input: UpdateUserNameInput): Promise<User> {
        const userId = UserId.create(input.userId);
        const user = await this.userRepository.findById(userId);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        user.changeName(input.newFirstName, input.newLastName);
        
        await this.userRepository.save(user);
        
        return user;
    }
}