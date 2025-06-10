import { IUserRepository } from '../repositories/IUserRepository';
import { User } from '../entities/User';
import { UpdateUserRequest } from '../entities/@types/UpdateUserRequest';
import { prisma } from '../../../../infra/database/prismaClient';

export class UserRepository implements IUserRepository {
  
  async save(name: string, email: string, hashedPassword: string): Promise<User> {
    const data = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return data;
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await prisma.user.findUnique({
      where: { email }
    });

    if (!data) {
      return null;
    }

    return data;
  }

  async findById(id: string): Promise<User | null> {
    const data = await prisma.user.findUnique({
      where: { id }
    });

    if (!data) {
      return null;
    }

    return data;
  }

  async update(updateUser: UpdateUserRequest, id: string): Promise<User> {
    const { name, email, password } = updateUser;
    const data = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password
      }
    });

    return data;
  }

}