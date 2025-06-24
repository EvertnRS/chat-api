import { IUserRepository } from '../domain/repositories/IUserRepository';
import type { UpdateUserRequest } from '../../../@types/user/UpdateUserRequest';
import type { UserResponse } from '../../../@types/user/UserResponse';
import bcrypt from 'bcrypt';

export class UpdateUser {
    constructor(private userRepository: IUserRepository) {}

    async update({ name, email, password }: UpdateUserRequest, id: string): Promise<UserResponse> {
        if (!id) {
            throw new Error("User ID is required");
        }

        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error("User not found");
        }

        if (email) {
            const userWithEmail = await this.userRepository.findByEmail(email);
            if (userWithEmail && userWithEmail.id !== id) {
                throw new Error("Email is already in use by another user");
            }
        }

        const updatedData: UpdateUserRequest = {};
        if (name) updatedData.name = name;
        if (email) updatedData.email = email;
        if (password) updatedData.password = await bcrypt.hash(password, 10);

        return await this.userRepository.update(updatedData, id);
        
    }
}