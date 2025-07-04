import { UserResponse } from '../../../@types/user/UserResponse';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import bcrypt from 'bcrypt';

export class ListUser {
    constructor(private userRepository: IUserRepository) {}

        async listUser(id: string | undefined): Promise<UserResponse[]> {
            let users: UserResponse[] | undefined;
            if(id) {
                const foundUser = await this.userRepository.findById(id);
                if (foundUser) {
                    const user = {
                        id: foundUser.id,
                        name: foundUser.name,
                        email: foundUser.email
                    };
                    users = [user];
                } else {
                    users = undefined;
                }
            } else {
                users = await this.userRepository.getAll();
            }
            
            if (!users || users.length === 0) {
                throw new Error('User not found');
            }
            
            return users;
        }

}

