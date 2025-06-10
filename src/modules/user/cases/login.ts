import { IUserRepository } from '../domain/repositories/IUserRepository';
import { User } from '../domain/entities/User';
import { JWTProvider } from '../../../infra/providers/JWTProvider';
import bcrypt from 'bcrypt';

interface LoginDTO {
  email: string;
  password: string;
}

export class Login {
    constructor (private userRepository: IUserRepository) {}
    
    async login({ email, password }: LoginDTO) {
        if(!email || !password) {
            throw new Error("Invalid inputs");
        }
        
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const token = new JWTProvider().sign({ id: user.id });

        return { token };
    }
}