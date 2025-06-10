import { User } from '../entities/User';
import type { UpdateUserRequest } from '../entities/@types/updateUserRequest';

export interface IUserRepository {
    save(name: string, email: string, hashedPassword: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(updateUser: UpdateUserRequest, id: string): Promise<User>;
}