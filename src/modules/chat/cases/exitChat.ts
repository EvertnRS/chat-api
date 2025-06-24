import { IChatRepository } from "../domain/repositories/IChatRepository";
import { IUserRepository } from "../../user/domain/repositories/IUserRepository";
import { Chat } from "../domain/entities/Chat";

export class ExitChat{
    constructor(
        private readonly chatRepository: IChatRepository,
        private readonly userRepository: IUserRepository
    ) {}
    
    async exit(id: string, userId: string) : Promise<void> {
        const chat = await this.chatRepository.findById(id);

        if (!chat) {
            throw new Error("Chat not found");
        }

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("Chat not found");
        }

        if (!chat.participants.includes(user.id)) {
            throw new Error("User is not a participant of this chat");
        }

        await this.chatRepository.exitChat(id, userId);
    }
}