import { Request, Response } from 'express';
import { CreateUser, UpdateUser, DeleteUser } from '../cases';
import { IUserRepository } from '../domain/repositories/IUserRepository';

export class UserController {
    constructor(
            private readonly userRepository: IUserRepository,
        ) {}
    
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

        const updateUser = new UpdateUser(this.userRepository);
        
        try {
            const result = await updateUser.update({ name, email, password }, id);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete (req: Request, res: Response) {
        const { id } = req.params;
        const { password } = req.body;

        const deleteUser = new DeleteUser(this.userRepository);

        try {
            await deleteUser.delete(password, id);
            return res.status(204).json();
            
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
