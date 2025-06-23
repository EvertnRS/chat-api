import { Request, Response } from 'express';
import { Login } from '../cases';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IAuthProvider } from '../../../infra/providers/auth/IAuthProvider';
import { LoginSchema } from '../dto/LoginDTO';

export class AuthController {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authProvider: IAuthProvider
    ) {}
    
    async login (req: Request, res: Response) {
        try {
            const data = LoginSchema.parse(req.body);
            const login = new Login(this.userRepository, this.authProvider);
            const result = await login.login(data); 
            return res.status(201).json(result);
            
        } catch (error: any) {
            return res.status(400).json({error: error.message});
        }
    }
}
