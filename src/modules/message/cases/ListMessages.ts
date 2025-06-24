import { IMessageRepository } from "../domain/repositories/IMessageRepository";
import { IChatRepository } from "../../chat/domain/repositories/IChatRepository";
import { IUserRepository } from "../../user/domain/repositories/IUserRepository";
import { Message } from "../domain/entities/Message";
import { ListMessageRequest } from "../../../@types/message/ListMessageRequest";
import { MessageResponse } from "../../../@types/message/MessageResponse";

export class ListMessages {
    constructor(
        private readonly messageRepository: IMessageRepository,
        private readonly chatRepository: IChatRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async listMessages({ chatId, page, limit }: ListMessageRequest, sender: string): Promise<MessageResponse[]> {
        const chat = await this.chatRepository.findById(chatId);

        if (!chat) {
            throw new Error('Chat not found');
        }

        const user = await this.userRepository.findById(sender);

        if (!user) {
            throw new Error("User not found");
        }
        
        if (!chat.participants.includes(user.id)) {
            throw new Error('You are not a participant in this chat');
        }
        
        try {
            const messages = await this.messageRepository.listMessagesByChatId({chatId, page, limit});
            return messages;
        } catch (error) {
            throw new Error('Could not list messages');
        }
    }
}