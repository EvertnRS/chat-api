import { User } from '../entities/User';

export interface IUserRepository {
    save(name: string, email: string, hashedPassword: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}