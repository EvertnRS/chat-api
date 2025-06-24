import { IMessageRepository } from "../domain/repositories/IMessageRepository";
import { IStorageProvider } from "../../../infra/providers/storage/IStorageProvider";
import { IUserRepository } from "../../user/domain/repositories/IUserRepository";
import { IChatRepository } from "../../chat/domain/repositories/IChatRepository";

export class DeleteMessage {
    constructor(
        private readonly messageRepository: IMessageRepository,
        private readonly storageProvider: IStorageProvider,
        private readonly userRepository: IUserRepository,
        private readonly chatRepository: IChatRepository
    ) {}

    async delete(id: string, sender: string): Promise<void> {
        const user = await this.userRepository.findById(sender);

        if (!user) {
            throw new Error("User not found");
        }

        const message = await this.messageRepository.findById(id);
        if (!message) {
            throw new Error("Message not found");
        }

        const chat = await this.chatRepository.findById(message.recipient);
        if (!chat) {
            throw new Error('Chat not found');
        }

        if (!chat.participants.includes(user.id)) {
            throw new Error('User is not a participant of the chat');
        }

        if(user.id !== message.sender) {
            throw new Error("You can only delete your own messages");
        }
            
        if(message.file) {
            this.storageProvider.deleteFile(message.file)
        }

        await this.messageRepository.delete(id);
    }
}
