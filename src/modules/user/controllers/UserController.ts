import { Request, Response } from 'express';
import { CreateUser, UpdateUser } from '../cases';
import { UserRepository } from '../domain/repositories/UserRepository';

export class UserController {
    private readonly userRepository = new UserRepository();
    
    async register (req: Request, res: Response) {
        const { name, email, password } = req.body;
        const createUser = new CreateUser(this.userRepository);
        
        try {
            const result = await createUser.create({ name, email, password }); 
            return res.status(201).json(result);
            
        } catch (error: any) {
            return res.status(400).json({error: error.message});
        }
    }

    async update (req: Request, res: Response) {
        const { id } = req.params;
        const { name, email, password } = req.body;

        try {
            const updateUser = new UpdateUser(this.userRepository);
            const result = await updateUser.update({ name, email, password }, id);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
