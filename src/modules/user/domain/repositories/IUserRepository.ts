import { User } from '../entities/User';
import type { UpdateUserRequest } from '../../../../@types/user/UpdateUserRequest';
import type { CreateUserRequest } from '../../../../@types/user/CreateUserRequest';

export interface IUserRepository {
    save(createUser: CreateUserRequest): Promise<User>;
    update(updateUser: UpdateUserRequest, id: string): Promise<User>;
    delete(id: string): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findManyById(ids: string[]): Promise<User[]>;
}