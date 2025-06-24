import { IUserRepository } from '../../user/domain/repositories/IUserRepository';
import { IChatRepository } from '../../chat/domain/repositories/IChatRepository';
import { IMessageRepository } from '../domain/repositories/IMessageRepository';
import { IWebSocketProvider } from '../../../infra/providers/websocket/IWebSocketProvider';
import { UpdateMessageRequest } from '../../../@types/message/UpdateMessageRequest';
import { SendUpdatedMessage } from './send/SendUpdatedMessage';
import type { MessageResponse } from '../../../@types/message/MessageResponse';

export class UpdateMessage {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly chatRepository: IChatRepository,
        private readonly messageRepository: IMessageRepository,
        private readonly webSocketProvider: IWebSocketProvider,
    ) {}

    async update(updateMessageRequest : UpdateMessageRequest): Promise<MessageResponse> {
        const { sender, recipient , messageId, newContent } = updateMessageRequest;

        const user = await this.userRepository.findById(sender);
        if (!user) {
            throw new Error('User not found');
        }

        const chat = await this.chatRepository.findById(recipient);
        if (!chat) {
            throw new Error('Chat not found');
        }

        const message = await this.messageRepository.findById(messageId);
        if (!message) {
            throw new Error('Message not found');
        }

        if (message.sender !== sender) {
            throw new Error('You can only update your own messages');
        }

        const data : UpdateMessageRequest = {
            sender: user.id,
            recipient: chat.id,
            messageId,
            newContent,
        };
        
        new SendUpdatedMessage(this.webSocketProvider).send(data);

        const updatedMessage = await this.messageRepository.update(data);

        return updatedMessage;
    }
}