import { Request, Response } from 'express';
import { Login } from '../cases';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IAuthProvider } from '../../../infra/providers/auth/IAuthProvider';

export class AuthController {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authProvider: IAuthProvider
    ) {}
    
    async login (req: Request, res: Response) {
        const { email, password } = req.body;
        const login = new Login(this.userRepository, this.authProvider);
        
        try {
            const result = await login.login({ email, password }); 
            return res.status(201).json(result);
            
        } catch (error: any) {
            return res.status(400).json({error: error.message});
        }
    }
}
