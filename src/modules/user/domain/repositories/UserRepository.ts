import { IUserRepository } from '../repositories/IUserRepository';
import { User } from '../entities/User';
import { UpdateUserRequest } from '../../../../@types/user/UpdateUserRequest';
import type { CreateUserRequest } from '../../../../@types/user/CreateUserRequest';
import type { DeleteUserRequest } from '../../../../@types/user/DeleteUserRequest';
import { postgres } from '../../../../infra/database/prismaClient';
import { UserResponse } from '../../../../@types/user/UserResponse';

export class UserRepository implements IUserRepository {
  
  async save(createUser: CreateUserRequest): Promise<UserResponse> {
    const { name, email, hashedPassword } = createUser;
    const data = await postgres.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return {
      id: data.id,
      name: data.name,
      email: data.email
    };
  }
  
  async update(updateUser: UpdateUserRequest, id: string): Promise<UserResponse> {
    const { name, email, password } = updateUser;
    const data = await postgres.user.update({
      where: { id },
      data: {
        name,
        email,
        password
      }
    });
  
    return {
      id: data.id,
      name: data.name,
      email: data.email
    };
  }

async delete (deleteUser : DeleteUserRequest): Promise<void> {
    const { id } = deleteUser;
    await postgres.user.delete({
      where: { id }});
    }

  async findByEmail(email: string): Promise<User | null> {
    const data = await postgres.user.findUnique({
      where: { email }
    });

    if (!data) {
      return null;
    }

    return data;
  }

  async findById(id: string): Promise<User | null> {
    const data = await postgres.user.findUnique({
      where: { id }
    });

    if (!data) {
      return null;
    }

    return data;
  }

  async findManyById(ids: string[]): Promise<User[]> {    
    const data = await postgres.user.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    return data;
  }

  async getAll(): Promise<UserResponse[]> {
    const data = await postgres.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    return data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email
    }));
  }
}