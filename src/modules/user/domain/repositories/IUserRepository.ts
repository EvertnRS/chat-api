import { User } from '../entities/User';
import type { UpdateUserRequest } from '../../../../@types/UpdateUserRequest';
import type { CreateUserRequest } from '../../../../@types/CreateUserRequest';

export interface IUserRepository {
    save(createUser: CreateUserRequest): Promise<User>;
    update(updateUser: UpdateUserRequest, id: string): Promise<User>;
    delete(id: string): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}