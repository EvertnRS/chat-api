import { IMessageRepository } from "../domain/repositories/IMessageRepository";
import { IChatRepository } from "../../chat/domain/repositories/IChatRepository";
import { Message } from "../domain/entities/Message";
import { ListMessageRequest } from "../../../@types/message/ListMessageRequest";

export class ListMessages {
    constructor(
        private readonly messageRepository: IMessageRepository,
        private readonly chatRepository: IChatRepository
    ) {}

    async listMessages({ chatId, page, limit }: ListMessageRequest): Promise<Message[]> {
        try {
            const messages = await this.messageRepository.listMessagesByChatId({chatId, page, limit});
            return messages;
        } catch (error) {
            console.error('Error listing messages:', error);
            throw new Error('Could not list messages');
        }
    }
}