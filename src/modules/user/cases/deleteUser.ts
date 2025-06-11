import { IUserRepository } from '../domain/repositories/IUserRepository';
import bcrypt from 'bcrypt';

export class DeleteUser {
    constructor(private userRepository: IUserRepository) {}

        async delete(password: string, id: string) {
            if (!id || !password) {
                throw new Error("Invalid inputs");
            }

            const existingUser = await this.userRepository.findById(id);
            if (!existingUser) {
                throw new Error("User not found");
            }

            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                throw new Error("Invalid password");
            }

            return await this.userRepository.delete(id);
            
        }
}