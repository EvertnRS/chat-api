import { IUserRepository } from '../domain/repositories/IUserRepository';
import { LoginDTO } from '../../../@types/user/LoginRequest';
import { IAuthProvider } from '../../../infra/providers/auth/IAuthProvider';
import bcrypt from 'bcrypt';
import { LoginResponse } from '../../../@types/user/LoginResponse';


export class Login {
    constructor (private userRepository: IUserRepository,
                 private authProvider: IAuthProvider
    ) {}
    
    async login({ email, password }: LoginDTO): Promise<LoginResponse> {
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

        const token = this.authProvider.sign({ id: user.id });

        return { 
            user: { id: user.id },
            token 
        };
    }
}