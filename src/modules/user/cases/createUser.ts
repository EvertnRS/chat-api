import { IUserRepository } from '../domain/repositories/IUserRepository';
import type { CreateUserRequest } from '../../../@types/user/CreateUserRequest';
import type { UserResponse } from '../../../@types/user/UserResponse';
import bcrypt from 'bcrypt';

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export class CreateUser {
    constructor (private userRepository: IUserRepository) {}
    
    async create({ name, email, password }: CreateUserDTO): Promise<UserResponse> {
        if(!name || !email || !password) {
            throw new Error("Invalid inputs");
        }

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const registerData: CreateUserRequest = {
            name,
            email,
            hashedPassword: hashedPassword
        };
        
        return await this.userRepository.save(registerData);
    }
}