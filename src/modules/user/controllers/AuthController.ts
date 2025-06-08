import { Request, Response } from 'express';
import { Login } from '../cases';
import { UserRepository } from '../domain/repositories/UserRepository';

export class AuthController {
    private readonly userRepository = new UserRepository();
    
    async login (req: Request, res: Response) {
        const { email, password } = req.body;
        const login = new Login(this.userRepository);
        
        try {
            const result = await login.login({ email, password }); 
            return res.status(201).json(result);
            
        } catch (error: any) {
            return res.status(400).json({error: error.message});
        }
    }
}
