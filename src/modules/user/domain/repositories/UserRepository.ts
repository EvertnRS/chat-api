import { IUserRepository } from '../repositories/IUserRepository';
import { User } from '../entities/User';
import { UpdateUserRequest } from '../../../../@types/user/UpdateUserRequest';
import type { CreateUserRequest } from '../../../../@types/user/CreateUserRequest';
import type { DeleteUserRequest } from '../../../../@types/user/DeleteUserRequest';
import { postgres } from '../../../../infra/database/prismaClient';

export class UserRepository implements IUserRepository {
  
  async save(createUser: CreateUserRequest): Promise<User> {
    const { name, email, hashedPassword } = createUser;
    const data = await postgres.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return data;
  }
  
  async update(updateUser: UpdateUserRequest, id: string): Promise<User> {
    const { name, email, password } = updateUser;
    const data = await postgres.user.update({
      where: { id },
      data: {
        name,
        email,
        password
      }
    });
  
    return data;
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
}