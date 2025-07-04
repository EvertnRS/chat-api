import { Request, Response } from 'express';
import { CreateUser, UpdateUser, DeleteUser, ListUser } from '../cases';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { CreateUserSchema } from '../dto/CreateUserDTO';
import { UpdateUserBodySchema } from '../dto/UpdateUserDTO';
import { DeleteUserBodySchema } from '../dto/DeleteUserDTO';
import { UserParamsSchema } from '../dto/IdUserParamsSchema';
import { UserQuerySchema } from '../dto/UserQuerySchema';

export class UserController {
    constructor(
        private readonly userRepository: IUserRepository,
    ) { }

    async register(req: Request, res: Response) {
        try {
            const data = CreateUserSchema.parse(req.body);
            const createUser = new CreateUser(this.userRepository);
            const result = await createUser.create(data);
            return res.status(201).json(result);

        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const params = UserParamsSchema.parse(req.params);
            const data = UpdateUserBodySchema.parse(req.body);
            const userId = UserParamsSchema.parse({ id: req.user?.id }).id;

            const updateUser = new UpdateUser(this.userRepository);
            const result = await updateUser.update(data, params.id, userId);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const params = UserParamsSchema.parse(req.params);
            const body = DeleteUserBodySchema.parse(req.body);

            const deleteUser = new DeleteUser(this.userRepository);
            const userId = UserParamsSchema.parse({ id: req.user?.id }).id;
            await deleteUser.delete(body.password, params.id, userId);
            return res.status(204).json();

        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async listUser(req: Request, res: Response) {
        try {
            const { id } = UserQuerySchema.parse(req.query);

            const listUser = new ListUser(this.userRepository);
            const user = await listUser.listUser(id);

            return res.status(200).json(user);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
