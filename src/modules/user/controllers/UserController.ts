import { Request, Response } from 'express';
import { CreateUser, UpdateUser, DeleteUser } from '../cases';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { CreateUserSchema } from '../dto/CreateUserDTO';
import { UpdateUserBodySchema, UpdateUserParamsSchema } from '../dto/UpdateUserDTO';
import { DeleteUserParamsSchema, DeleteUserBodySchema } from '../dto/DeleteUserDTO';

export class UserController {
    constructor(
            private readonly userRepository: IUserRepository,
        ) {}
    
    async register (req: Request, res: Response) {
        try {
            const data = CreateUserSchema.parse(req.body);
            const createUser = new CreateUser(this.userRepository);
            const result = await createUser.create(data); 
            return res.status(201).json(result);
            
        } catch (error: any) {
            return res.status(400).json({error: error.message});
        }
    }

    async update (req: Request, res: Response) {    
        try {
            const params = UpdateUserParamsSchema.parse(req.params);
            const data = UpdateUserBodySchema.parse(req.body);

            const updateUser = new UpdateUser(this.userRepository);
            const result = await updateUser.update(data, params.id);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete (req: Request, res: Response) {
        try {
            const params = DeleteUserParamsSchema.parse(req.params);
            const body = DeleteUserBodySchema.parse(req.body);

            const deleteUser = new DeleteUser(this.userRepository);
            await deleteUser.delete(body.password, params.id);
            return res.status(204).json();
            
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
