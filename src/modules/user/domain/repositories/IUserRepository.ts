import { User } from '../entities/User';
import type { UpdateUserRequest } from '../../../../@types/user/UpdateUserRequest';
import type { CreateUserRequest } from '../../../../@types/user/CreateUserRequest';
import type { DeleteUserRequest } from '../../../../@types/user/DeleteUserRequest';
import { UserResponse } from '../../../../@types/user/UserResponse';

export interface IUserRepository {
    save(createUser: CreateUserRequest): Promise<UserResponse>;
    update(updateUser: UpdateUserRequest, id: string): Promise<UserResponse>;
    delete(deleteUser: DeleteUserRequest): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findManyById(ids: string[]): Promise<User[]>;
}